import Web3 from 'web3';
import { resolve } from 'dns';
import 'core-js/modules/es7.symbol.async-iterator'; // for async iterator

// agent
import RayonArtifactAgent from './RayonArtifactAgent';

// model
import { Block, Transaction, TxReceipt } from '../../common/model/Web3Type';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';
import TxHistory, { FunctionHistory, EventHistory } from '../../common/model/TxHistory';

// util
import ContractUtil from '../../common/util/ContractUtil';
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

class RayonLogCollectAgent {
  private SIGNITURE_INDEX = 0;

  private _web3: Web3;
  private _contracts: string[];
  private _readLastBlockNumber: number = 4076312;

  constructor() {
    this._setWeb3();
    this._contracts = ContractConfigure.getRayonContractAddresses();
  }

  public async collectionStart() {
    for await (const rayonContractTxHistories of this._getRayonTxHistoriesInBlocks()) {
      // TODO: save rayonContractTxHistories to database
      console.log('rayonContractTxHistories', rayonContractTxHistories);
    }
  }

  private _setWeb3(): void {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private async *_getRayonTxHistoriesInBlocks(): AsyncIterableIterator<TxHistory[]> {
    while (true) {
      const latestBlock = await this._web3.eth.getBlock('latest');
      const readLastBlock: Block = await this._web3.eth.getBlock(this._readLastBlockNumber);
      console.log(readLastBlock.number);
      if (readLastBlock.number === latestBlock.number) {
        await this._sleep(ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
        continue;
      }

      const rayonContractTxHistories = await this._getRayonContractTxHistories(readLastBlock);

      if (rayonContractTxHistories.length) yield rayonContractTxHistories;
      this._readLastBlockNumber++;
    }
  }

  private async _getRayonContractTxHistories(currentBlock: Block): Promise<TxHistory[]> {
    const txHistory: TxHistory[] = await Promise.all(
      currentBlock.transactions.map(async transactionHash => {
        const transaction: Transaction = await this._web3.eth.getTransaction(transactionHash);
        if (!this._isRayonContractTx(transaction.to)) return;

        const txReceipt: TxReceipt = await this._web3.eth.getTransactionReceipt(transaction.hash);
        return this._makeTxHistory(transaction, txReceipt, currentBlock);
      })
    );

    return ArrayUtil.removeUndefinedElements(txHistory);
  }

  private _isRayonContractTx(txContractAddress: string) {
    const contractAddress = txContractAddress !== null && txContractAddress.toLowerCase();
    return this._contracts.indexOf(contractAddress) > -1;
  }

  private _makeTxHistory(transaction: Transaction, txReceipt: TxReceipt, currentBlock: Block): TxHistory {
    const contractAddress = transaction.to.toLowerCase();
    const functionSignature = transaction.input.slice(0, 10).toLowerCase();
    const functionParameter = transaction.input.slice(10, -1).toLowerCase();

    const functionHistory = {
      blockNumber: transaction.blockNumber,
      txHash: transaction.hash,
      calledTime: currentBlock.timestamp,
      status: txReceipt.status,
      contractAddress,
      functionName: RayonArtifactAgent.getFunctionFullName(contractAddress, functionSignature),
      inputData: JSON.stringify(
        RayonArtifactAgent.getFunctionParameters(contractAddress, functionSignature, functionParameter)
      ),
    };
    const eventHistories: EventHistory[] = txReceipt.logs.map(log => {
      const eventSignature = log.topics[this.SIGNITURE_INDEX].toLowerCase();
      const eventParameter = this._getEventParameter(log.topics, log.data);
      return Object.assign(functionHistory, {
        eventName: RayonArtifactAgent.getEventFullName(contractAddress, eventSignature),
        inputData: JSON.stringify(
          RayonArtifactAgent.getEventParameters(contractAddress, eventSignature, eventParameter)
        ),
      });
    });
    return {
      functionHistory,
      eventHistories,
    };
  }

  private _getEventParameter(topics: string[], data: string) {
    if (topics.length === 0) return;
    return (
      topics.map((topic, index) => (index === this.SIGNITURE_INDEX ? undefined : topic.slice(2))).join('') +
      data.slice(2)
    );
  }

  private _sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

export default new RayonLogCollectAgent();
