import Web3 from 'web3';
import 'core-js/modules/es7.symbol.async-iterator'; // for async iterator

// agent
import RayonArtifactAgent from './RayonArtifactAgent';

// model
import { Block, Transaction, PastLog, PastEvent, TxReceipt } from '../model/Web3Type';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';
import TxHistory, { FunctionHistory, EventHistory } from '../model/TxHistory';

// util
import ContractUtil from '../util/ContractUtil';
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

import { resolve } from 'dns';

class RayonBlockchainAgent {
  private _web3: Web3;

  private _readLastBlockNumber: number = 4076312;

  private _contracts: string[];

  constructor() {
    this._contracts = ContractConfigure.getRayonContractAddresses();
  }

  public startBlockchainHistoryLogStore() {
    this._setWeb3();
    this._startCollectAndStoreRayonTxHistory();
  }

  private _sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  private _setWeb3(): void {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private async _startCollectAndStoreRayonTxHistory() {
    for await (const rayonContractTxHistories of this._getRayonTxHistoriesInBlocks()) {
      // console.log('txHistories :', rayonContractTxHistories);
      console.log('eventHisoryies', rayonContractTxHistories[0].eventHistories);
    }
  }

  private async *_getRayonTxHistoriesInBlocks(): AsyncIterableIterator<TxHistory[]> {
    while (true) {
      const latestBlock = await this._web3.eth.getBlock('latest');
      const readLastBlock: Block = await this._web3.eth.getBlock(this._readLastBlockNumber);
      if (readLastBlock.number === latestBlock.number) {
        await this._sleep(ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
        continue;
      }
      console.log(readLastBlock.number);

      const rayonContractTxHistories = await this._getRayonContractTxHistories(readLastBlock);
      // const contract

      if (rayonContractTxHistories.length) {
        yield rayonContractTxHistories;
      }

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
      txHash: transaction.hash,
      calledTime: currentBlock.timestamp,
      status: txReceipt.status,
      contractAddress,
      functionName: RayonArtifactAgent.getFunctionFullName(contractAddress, functionSignature),
      // inputData: JSON.stringify(this._artifactAgent.getFunctionInputs(contractAddress, functionSignature)),
      inputData: JSON.stringify(
        RayonArtifactAgent.getFunctionParameters(contractAddress, functionSignature, functionParameter)
      ),
    };
    const eventHistories: EventHistory[] = txReceipt.logs.map(log => {
      const eventSignature = log['topics'][0].toLowerCase();
      return Object.assign(functionHistory, {
        eventName: RayonArtifactAgent.getEventFullName(contractAddress, eventSignature),
      });
    });
    return {
      functionHistory,
      eventHistories,
    };
  }
}

export default new RayonBlockchainAgent();
