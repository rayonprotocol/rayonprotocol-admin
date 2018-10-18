// agent
import DbAgent from '../../common/agent/DbAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// model
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class RayonLogDbAgent {
  // getter

  public async getNextBlockToRead() {
    let queryResult;
    queryResult = await DbAgent.executeAsync(`
      SELECT MAX(block_number) readLastBlock FROM rayon.event_log
    `);
    queryResult = queryResult && queryResult.pop();
    return queryResult.readLastBlock === null ? ContractConfigure.CONTRACTBLOCK_TESTNET : queryResult.readLastBlock + 1;
  }

  // store

  public storeTxLogs(txLogs: TxLog[]) {
    txLogs.forEach(txLog => {
      this._storeTxFunctionLog(txLog.functionLog);
      txLog.eventLogs.forEach(eventLog => {
        this._storeTxEventLogs(eventLog);
      });
    });
  }

  private async _storeTxFunctionLog(functionLog: FunctionLog) {
    const result = await DbAgent.executeAsync(
      `
        INSERT INTO rayon.function_log (
            block_number,
            tx_hash,
            status,
            contract_address,
            function_name,
            input_data,
            called_time,
            url_etherscan,
            environment) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
        )`,
      [
        functionLog.blockNumber,
        functionLog.txHash.toLowerCase(),
        functionLog.status,
        functionLog.contractAddress.toLowerCase(),
        functionLog.functionName,
        functionLog.inputData,
        functionLog.calledTime,
        functionLog.urlEtherscan,
        functionLog.environment,
      ]
    );

    // console.log('storeResult', result);
  }

  private async _storeTxEventLogs(eventLog: EventLog) {
    const result = await DbAgent.executeAsync(
      `
        INSERT INTO rayon.event_log (
            block_number,
            tx_hash,
            status,
            contract_address,
            event_name,
            function_name,
            input_data,
            called_time,
            url_etherscan,
            environment) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
        )`,
      [
        eventLog.blockNumber,
        eventLog.txHash.toLowerCase(),
        eventLog.status,
        eventLog.contractAddress.toLowerCase(),
        eventLog.eventName,
        eventLog.functionName,
        eventLog.inputData,
        eventLog.calledTime,
        eventLog.urlEtherscan,
        eventLog.environment,
      ]
    );

    // console.log('storeResult', result);
  }
}

export default new RayonLogDbAgent();
