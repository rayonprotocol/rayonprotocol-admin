import Web3 from 'web3';
import { resolve } from 'dns';
import 'core-js/modules/es7.symbol.async-iterator'; // for async iterator

// agent
import RayonLogDbAgent from './RayonLogDbAgent';

// model
import { TxBlock, Transaction, TxReceipt } from '../../common/model/Web3Type';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import Web3Controller from '../../common/controller/Web3Controller';
import { ABI_TYPE_EVENT, ABI_TYPE_FUNCTION } from '../../../../shared/contract/model/Contract';
import RayonArtifactAgent from './RayonArtifactAgent';

class RayonLogCollectAgent {
  public async collectionStart() {
    // 제너레이터를 실행시켜, 가공된 rayon의 transaction log를 순차적으로 받아옴
    for await (const rayonContractTxLogs of this._generateRayonContractTxLogs()) {
      console.log('rayonContractTxLogs', rayonContractTxLogs);
      RayonLogDbAgent.storeTxLogs(rayonContractTxLogs);
    }
  }

  // contract transaction을 생성하는 제너레이터
  private async *_generateRayonContractTxLogs(): AsyncIterableIterator<TxLog[]> {
    let nextBlockNumber = await RayonLogDbAgent.getNextBlockToRead();
    while (true) {
      const latestBlock = await Web3Controller.getWeb3().eth.getBlock('latest');
      const nextBlockToRead: TxBlock = await Web3Controller.getWeb3().eth.getBlock(nextBlockNumber, true);

      console.log('blockNumber:', nextBlockNumber);
      if (nextBlockToRead.number === latestBlock.number) {
        await this._sleep(ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
        continue;
      }

      const rayonContractTxLogs = await this._getRayonContractTxLogs(nextBlockToRead);

      if (rayonContractTxLogs.length) yield rayonContractTxLogs;
      nextBlockNumber++;
    }
  }

  private async _getRayonContractTxLogs(txBlock: TxBlock): Promise<TxLog[]> {
    const txLog: TxLog[] = await Promise.all(
      txBlock.transactions.map(async transaction => {
        if (!RayonArtifactAgent.isRayonContract(transaction.to)) return;

        const txReceipt: TxReceipt = await Web3Controller.getWeb3().eth.getTransactionReceipt(transaction.hash);
        const functionLog: FunctionLog = this._makeFunctionLog(txReceipt, transaction, txBlock);
        const eventLogs: EventLog[] = this._makeEventLogs(functionLog, txReceipt, transaction, txBlock);

        return {
          functionLog,
          eventLogs,
        };
      })
    );

    return ArrayUtil.removeUndefinedElements(txLog);
  }

  private _makeFunctionLog(txReceipt: TxReceipt, transaction: Transaction, txBlock: TxBlock): FunctionLog {
    const contractAddress = transaction.to.toLowerCase();
    const functionSignature = transaction.input.slice(0, 10).toLowerCase();
    const functionParameter = transaction.input.slice(10).toLowerCase();
    return {
      blockNumber: transaction.blockNumber,
      txHash: transaction.hash,
      calledTime: txBlock.timestamp,
      status: txReceipt.status,
      contractAddress,
      functionName: RayonArtifactAgent.getFullName(contractAddress, functionSignature),
      inputData: RayonArtifactAgent.getParameters(contractAddress, functionSignature, functionParameter),
      urlEtherscan: `https://etherscan.io/tx/${transaction.hash}`,
      environment: process.env.ENV_BLOCKCHAIN,
    };
  }

  private _makeEventLogs(functionLog: FunctionLog, txReceipt: TxReceipt, transaction: Transaction, txBlock: TxBlock) {
    const contractAddress = transaction.to.toLowerCase();
    return txReceipt.logs.map(log => {
      const eventSignature = log.topics.shift().toLowerCase(); // log.topics의 가장 첫번째 인자(signature)를 아예 빼는것이므로 주의
      const eventParameter = this._getEventParameter(log.topics, log.data);
      return {
        ...functionLog,
        eventName: RayonArtifactAgent.getFullName(contractAddress, eventSignature),
        inputData: RayonArtifactAgent.getParameters(contractAddress, eventSignature, eventParameter),
      };
    });
  }

  private _getEventParameter(topics: string[], data: string) {
    if (topics.length === 0) return;
    return topics.map((topic, index) => topic.slice(2)).join('') + data.slice(2);
  }

  private _sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

export default new RayonLogCollectAgent();
