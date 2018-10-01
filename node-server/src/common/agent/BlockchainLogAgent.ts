import Web3 from 'web3';

// agent
import RayonArtifactAgent from './RayonArtifactAgent';

// model
import { RayonEvent } from '../../../../shared/token/model/Token';
import { Block, Transaction, PastLog, PastEvent } from '../model/Web3Type';
import { FunctionHistory, EventHistory } from '../model/History';

// util
import ContractUtil from '../util/ContractUtil';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

if (Symbol['asyncIterator'] === undefined) (Symbol as any)['asyncIterator'] = Symbol.for('asyncIterator');

class RayonBlockchainAgent {
  private _web3: Web3;

  private _readLastBlockNumber: number = 4076310;

  private _contracts: Map<string, Set<RayonEvent>>; // key: address value: watched event
  private _artifactAgent: RayonArtifactAgent;

  public startBlockchainHistoryLogStore() {
    this._setWeb3();
    this._setContracts();
    this._collectHistory();
  }

  private _setContracts() {
    this._contracts = new Map<string, Set<RayonEvent>>();
    this._contracts.set(ContractConfigure.ADDR_RAYONTOKEN, new Set([RayonEvent.Mint, RayonEvent.Transfer]));
    this._artifactAgent = new RayonArtifactAgent(this._contracts);
  }

  private _setWeb3(): void {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private async _collectHistory() {
    // console.log('readLastBlock.number', readLastBlock.number);
    for await (const functionHistories of this._getFunctionHistories()) {
      console.log('functionHistories', functionHistories);
      // const eventHistories = await this._getEventHistories(readLastBlock);
    }

    //

    // TODO: save functionHistories, eventHistories

    // this._readLastBlockNumber++;
    // this._collectHistory();
  }

  private async *_getFunctionHistories() {
    while (true) {
      let latestBlockNumber = (await this._web3.eth.getBlock('latest')).number;
      let readLastBlock: Block = await this._web3.eth.getBlock(this._readLastBlockNumber);
      if (readLastBlock.number === latestBlockNumber) break;
      console.log(readLastBlock.number);
      // 요청
      const functionHistoryies = await Promise.all(
        readLastBlock.transactions.map(async transactionHash => {
          const transaction: Transaction = await this._web3.eth.getTransaction(transactionHash);
          return this._makeTransactionHistory(transaction, readLastBlock);
        })
      );
      const contractFunctionHistoryies = functionHistoryies.filter(
        functionHistory => typeof functionHistory !== 'undefined'
      );
      if (contractFunctionHistoryies.length) {
        yield contractFunctionHistoryies;
      }
      this._readLastBlockNumber++;
    }
  }

  private async _getEventHistories(currentBlock: Block): Promise<void> {
    this._contracts.forEach((events, address) => {
      const contractInstance = this._artifactAgent.getContractInstance(address);
      events.forEach(eventType => {
        contractInstance.getPastEvents(
          RayonEvent.getRayonEventName(eventType),
          { fromBlock: this._readLastBlockNumber + 1, toBlock: this._readLastBlockNumber + 1 },
          this._makeEventHistory.bind(this, currentBlock)
        );
      });
    });
  }

  private _makeTransactionHistory(transaction: Transaction, transactionBlock: Block): FunctionHistory {
    const contractAddress = transaction.to !== null && transaction.to.toLowerCase();
    if (this._contracts.get(contractAddress) === undefined) return;

    const functionSignature = transaction.input.slice(0, 10);
    return {
      calledTime: transactionBlock.timestamp,
      txHash: transaction.hash,
      contractAddress,
      functionName: this._artifactAgent.getFunctionFullName(contractAddress, functionSignature.toLowerCase()),
      inputData: JSON.stringify(
        this._artifactAgent.getFunctionInputs(contractAddress, functionSignature.toLowerCase())
      ),
    };
  }

  private _makeEventHistory(error, pastEvents: PastEvent[], currentBlock: Block): EventHistory[] {
    const eventHistories: EventHistory[] = [];
    pastEvents.forEach(event => {
      const eventHistory: EventHistory = {
        txHash: event.transactionHash,
        calledTime: currentBlock.timestamp,
        contractAddress: event.address,
        eventName: this._artifactAgent.getEventFullName(event.address, event.event),
      };
      eventHistories.push(eventHistory);
    });
    return eventHistories;
  }
}

export default new RayonBlockchainAgent();
