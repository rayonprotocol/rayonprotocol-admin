import Web3 from 'web3';

// agent
import RayonArtifactAgent from './RayonArtifactAgent';

// model
import { RayonEvent } from '../../../../shared/token/model/Token';
import { PastLog, PastEvent, FunctionHistory, EventHistory } from '../model/History';

// util
import ContractUtil from '../util/ContractUtil';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class RayonBlockchainAgent {
  private _web3: Web3;

  private _readLastEventBlockNumber: number = 3936470;
  private _readLastFunctionBlockNumber: number = 3936470;

  private _contracts: Map<string, Set<RayonEvent>>; // key: address value: watched event
  private _artifactAgent: RayonArtifactAgent;

  public startBlockchainHistoryLogStore() {
    this._setWeb3();
    this._setContracts();
    // this._collectHistory();
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

  private _collectHistory() {
    this._contracts.forEach((events, address) => {
      this._getPastLogs(address);
      this._getPastEvents(address, events);
    });
  }

  private async _getPastLogs(contractAddress: string): Promise<void> {
    const latestBlock = await this._web3.eth.getBlock('latest');
    if (this._readLastFunctionBlockNumber === latestBlock.blockNumber) return;
    this._web3.eth.getPastLogs(
      {
        fromBlock: this._readLastFunctionBlockNumber + 1,
        toBlock: latestBlock.blockNumber,
        address: contractAddress,
      },
      this._onFetchedPastLogs.bind(this)
    );
  }

  private async _getPastEvents(contractAddress: string, watchEvents: Set<RayonEvent>): Promise<void> {
    const latestBlock = await this._web3.eth.getBlock('latest');
    const contractInstance = this._artifactAgent.getContractInstance(contractAddress);

    if (this._readLastFunctionBlockNumber === latestBlock.blockNumber) return;

    watchEvents.forEach(eventType => {
      contractInstance.getPastEvents(
        RayonEvent.getRayonEventName(eventType),
        { fromBlock: this._readLastEventBlockNumber + 1, toBlock: latestBlock.blockNumber },
        this._onFetchedPastEvents.bind(this)
      );
    });
  }

  private _onFetchedPastLogs(error, result: PastLog[]) {
    result.map(async pastLog => {
      const block = await this._web3.eth.getBlock(pastLog.blockNumber);
      const parameters = pastLog.topics.length > 1 ? pastLog.topics.slice(1) : [];
      // const functionHistory: FunctionHistory = {
      //   calledTime: block.timestamp,
      //   txHash: pastLog.transactionHash,
      //   contractAddress: pastLog.address,
      //   // functionName: this._artifactAgent.getFunctionFullName(pastLog.topics[0]),
      //   // inputData: JSON.stringify(this._artifactAgent.getFunctionParameters(pastLog.topics[0], parameters)),
      // };
    });
  }

  private _onFetchedPastEvents(error, pastEvent: PastEvent[]) {
    console.log('event result', pastEvent);
  }
}

export default new RayonBlockchainAgent();
