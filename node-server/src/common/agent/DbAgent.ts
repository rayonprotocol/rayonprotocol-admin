import * as mysql from 'mysql';
import * as types from 'mysql/lib/protocol/constants/types';

// import GeneralUtil from '../util/GeneralUtil';
import { getDatabaseConfiguration } from '../../main/controller/configuration';
// import LogDataController from '../../main/log/datacontroller/LogDataController';

export const connection = mysql.createConnection(getDatabaseConfiguration());

const pool = mysql.createPool(getDatabaseConfiguration());

// connection.query 메소드의 리턴 값에 포함된 속성
interface QueryResultsInfo {
  insertId: string; // https://github.com/mysqljs/mysql#getting-the-id-of-an-inserted-row
  affectedRows: number; // https://github.com/mysqljs/mysql#getting-the-number-of-affected-rows
  changedRows: number; // https://github.com/mysqljs/mysql#getting-the-number-of-changed-rows
}

// transactionHelper의 queryAsync함수 리턴 타입
type QueryResult<T> = QueryResultsInfo & T;

// transactionHelper의 queryAsync함수 타입
interface QueryAsync {
  <S extends {}>(queryString: string, parameters?: any[]): Promise<QueryResult<S>>;
}

// transactionHelper 타입
export interface TransactionHelper {
  queryAsync: QueryAsync;
  commitAsync: () => Promise<void>;
  rollbackAsync: () => Promise<void>;
  transactionConnection: mysql.IConnection;
}

export type TransactionFunction<T> = (transactionHelper: TransactionHelper) => Promise<T>;

class DbAgent {
  public connection = mysql.createConnection(getDatabaseConfiguration());
  public pool = mysql.createPool(getDatabaseConfiguration());

  /**
   * mysql 모듈에서 사용하는 field 객체의 type(숫자)를 문자열로 변환
   * @param typeNumber mysql 모듈에서 사용하는 field 객체의 type
   */
  fieldTypeToString(typeNumber) {
    for (const typeName in types) {
      if (types[typeName] === typeNumber) return typeName;
    }
    return undefined;
  }

  /**
   * 각 case 별 query 맵을 전달하면 `getQueryByCase` 함수를 반환한다.
   * `getQueryByCase` 함수는 case를 전달받으며 case가 query 맵에서 일치하는 키의 함수를 실행한다.
   * `getQueryByCase` 함수는 string을 반환해야한다.
   * @param queryCaseMap 케이스별 쿼리 반환 함수가 정의되어있는 plain old javascript object
   */
  makeQueryCases(queryCaseMap: { [_case: string]: () => string } | { [_case: number]: () => string }) {
    /**
     *
     * @param _case query 케이스
     */
    function getQueryByCase(_case: string | number): string {
      return queryCaseMap[_case] ? queryCaseMap[_case]() : '';
    }
    return getQueryByCase;
  }

  queryAsync<T>(queryString: string, parameters: any[] = []): Promise<T[]> {
    // LogDataController.logger.info('queryString', GeneralUtil.inputParamToQueryString(queryString, parameters));
    return new Promise<T[]>((resolve, reject) => {
      pool.query(queryString, parameters, (err, result) => (err ? reject(err) : resolve(result)));
    });
  }

  queryAsync2<T>(queryString: string, parameters: any[] = []): Promise<T[]> {
    // LogDataController.logger.info('queryString', GeneralUtil.inputParamToQueryString(queryString, parameters));
    return new Promise<T[]>((resolve, reject) => {
      pool.query(queryString, parameters, (err, result) => (err ? reject(err) : resolve(result)));
    });
  }

  /**
   * 파라미터를 바인딩하여 쿼리를 실행하고 특정 조건을 만족하는 필드 값에 대해 후처리를 하여 반환한다.
   * @param queryString 쿼리 문자열
   * @param parameters 쿼리에 바인딩할 파라미터 배열
   */
  queryPostProcessingAsync<T>(queryString: string, parameters: any[] = []): Promise<T[]> {
    // LogDataController.logger.info('queryString', GeneralUtil.inputParamToQueryString(queryString, parameters));
    return new Promise<T[]>((resolve, reject) => {
      pool.query(queryString, parameters, (err, result, fields) => {
        if (err) return reject(err);
        const rows = result.map(row =>
          /**
           * 값, 타입 변환 룰
           * boolean 타입으로:
           *  - tinyint(1)인 경우,
           *  - bigint이면서 필드면이 is로시작하는 카멜 케이스인 경우
           * undefined 값으로:
           *  - 필드 값이 null 일때
           *  - 필드 값이 'NONE' 일때
           *  - 필드 값이 빈문자열 '' 일때
           */
          fields.reduce((processedRow, field) => {
            const name = field.name;
            const value = row[name];
            const typeName = this.fieldTypeToString(field.type);
            const fieldNameStartsWithIs = /^is[A-Z]/;
            const isBooleanField =
              (typeName === 'TINY' && field.length === 1) || // 'tinyint(1)'
              (typeName === 'LONGLONG' && fieldNameStartsWithIs.test(name)); // 'bigint'
            const isValueTobeUndefined = value === null || value === '' || value === 'NONE';

            processedRow[name] = isBooleanField ? value === 1 : isValueTobeUndefined ? undefined : value;
            return processedRow;
          }, {})
        );
        resolve(rows);
      });
    });
  }

  executeAsync(queryString: string, parameters: any[] = []): Promise<void> {
    // LogDataController.logger.info('queryString', GeneralUtil.inputParamToQueryString(queryString, parameters));
    return new Promise<void>((resolve, reject) => {
      pool.query(queryString, parameters, (err, result) => (err ? reject(err) : resolve(result)));
    });
  }

  async executeAsyncForOneRow(queryString: string, parameters: any[] = []): Promise<void> {
    let returnRow;
    returnRow = await this.executeAsync(queryString, parameters);
    if (returnRow.length > 1) throw new Error('executeAsyncForOneRow Error (More than 1 line.)');
    returnRow = returnRow && returnRow.pop();
    return returnRow;
  }

  /*
  * transaction의 콜백(`transactionFunction`)은
  * 명시적으로 commit, rollack을 할 수 있도록 transaction의 콜백에 `transactionHelper`가 주입된다.
  * transaction의 콜백 내부에서는 transactionHelper의 queryAsync를 써야 하나의 트랜잭션으로 묶인다.
  * (혹은 transactionHelper의 transactionConnection.query 사용)
  */
  async transaction<T>(transactionFunction: TransactionFunction<T>) {
    const transactionConnection = await new Promise<mysql.IConnection>((resolve, reject) => {
      pool.getConnection((err, resolvedConnection) => (err ? reject(err) : resolve(resolvedConnection)));
    });

    // commit, rollback 함수들을 async 함수화
    const commitAsync = () =>
      new Promise<void>((resolve, reject) => {
        transactionConnection.commit(err => (err ? reject(err) : resolve()));
      });
    const rollbackAsync = () =>
      new Promise<void>((resolve, reject) => {
        transactionConnection.rollback(() => resolve());
      });

    // 쿼리 실행 도중 에러가 있으면 트랜잭션을 롤백하고 해당 에러를 reject 한다.
    async function queryAsync<S>(queryString: string, parameters: any[] = []): Promise<QueryResult<S>> {
      return new Promise<QueryResult<S>>((resolve, reject) => {
        transactionConnection.query(queryString, parameters, async (err, result) => {
          if (err) {
            await rollbackAsync();
            // LogDataController.logger.error('execption caught on executing a query >> rollback');
            //console.log('execption caught on executing a query >> rollback');
            // sql 에러 발생시 `transaction failed`로 에러를 response하고, 실제 sql관련 에러는 warning으로만 확인하고 노출하지 않는다.
            //console.warn('message >>', err.message);
            //console.warn('sql     >>', err['sql'])
            // LogDataController.logger.error('message >>', err.message);
            // LogDataController.logger.error('sql     >>', err['sql']);
            const wrappedError = new Error('transaction failed');
            reject(wrappedError);
            return;
          }
          resolve(result);
        });
      });
    }
    const transactionHelper = {
      queryAsync,
      commitAsync,
      rollbackAsync,
      transactionConnection, // 추후 확장성을 위해 포함
    };

    return new Promise<T>((resolve, reject) => {
      // https://github.com/mysqljs/mysql#transactions
      transactionConnection.beginTransaction(async err => {
        if (err) reject(err);

        try {
          // 트랜잭션 진행이 정상완료되면 커밋하고 프로메스를 resolve 한다.
          const trasnsactionResult = await transactionFunction(transactionHelper);
          console.log(`transaction succes >> implicitly commit`);
          await commitAsync();
          resolve(trasnsactionResult as T);
        } catch (transactionErr) {
          // 트랜잭션 진행 도중 에러가 있으면 트랜잭션을 롤백하고 프로미스를 reject 한다.
          console.error('execption caught in transaction >> rollback');
          reject(transactionErr);
        } finally {
          transactionConnection.release();
        }
      });
    });
  }

  executeAsync2<T>(queryString: string, parameters: any[] = []): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      pool.query(queryString, parameters, (err, result) => (err ? reject(err) : resolve(result)));
    });
  }
}

export default new DbAgent();
