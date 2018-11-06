import Web3 from 'web3';
import { resolve } from 'dns';
import 'core-js/modules/es7.symbol.async-iterator'; // for async iterator

// agent
import RayonLogDbAgent from './RayonLogDbAgent';
import RayonArtifactAgent from './RayonArtifactAgent';
import ContractBlockchainAgent from '../../contract/agent/ContractBlockchainAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// model
import { TxBlock, Transaction, TxReceipt } from '../../common/model/Web3Type';
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';
import { newContract } from '../../../../shared/contract/model/Contract';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import DateUtil from '../../../../shared/common/util/DateUtil';
import ContractUtil from '../../../../shared/common/util/ContractUtil';

class RayonLogCollectAgent {
  private _contracts: newContract[];
  private _contractAddressList: string[];

  public async collectionStart() {
    this._contracts = await ContractBlockchainAgent.fetchAllContractInfo();
    this._contractAddressList = this._contracts.map(contract => contract.proxyAddress);
    // 제너레이터를 실행시켜, 가공된 rayon의 transaction log를 순차적으로 받아옴
    for await (const rayonContractTxLogs of this._generateRayonContractTxLogs()) {
      console.log('rayonContractTxLogs', rayonContractTxLogs);
      RayonLogDbAgent.storeTxLogs(rayonContractTxLogs);
    }
  }

  // contract transaction을 생성하는 제너레이터
  private async *_generateRayonContractTxLogs(): AsyncIterableIterator<TxLog[]> {
    let nextBlockNumber = await RayonLogDbAgent.getNextBlockNumberToRead();
    while (true) {
      const latestBlock = await Web3Controller.getWeb3().eth.getBlock('latest');

      if (nextBlockNumber - 1 === latestBlock.number) {
        console.log('blockNumber:', nextBlockNumber - 1);
        await DateUtil.sleep(ContractUtil.AUTOMAITC_REQUEST_TIME_INTERVAL);
        continue;
      } else {
        console.log('blockNumber:', nextBlockNumber);
      }

      const nextBlockToRead: TxBlock = await Web3Controller.getWeb3().eth.getBlock(nextBlockNumber, true);
      const rayonContractTxLogs = await this._getRayonContractTxLogs(nextBlockToRead);
      if (rayonContractTxLogs.length) yield rayonContractTxLogs;
      nextBlockNumber++;
    }
  }

  private async _getRayonContractTxLogs(txBlock: TxBlock): Promise<TxLog[]> {
    if (!txBlock) return [];
    const txLog: TxLog[] = await Promise.all(
      txBlock.transactions.map(async transaction => {
        if (this._contractAddressList.indexOf(transaction.to) === -1) return;

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
    const urlBase =
      process.env.ENV_BLOCKCHAIN === ContractUtil.ENV_TESTNET
        ? 'https://ropsten.etherscan.io/tx/'
        : 'https://etherscan.io/tx/';
    return {
      blockNumber: transaction.blockNumber,
      txHash: transaction.hash,
      calledTime: txBlock.timestamp,
      status: txReceipt.status,
      contractAddress,
      functionName: RayonArtifactAgent.getFullName(contractAddress, functionSignature),
      inputData: RayonArtifactAgent.getParameters(contractAddress, functionSignature, functionParameter),
      urlEtherscan: `${urlBase}${transaction.hash}`,
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
}

export default new RayonLogCollectAgent();
