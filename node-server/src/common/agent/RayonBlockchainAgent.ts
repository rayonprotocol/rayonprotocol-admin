import Web3 from 'web3';

// agent
import RayonArtifactAgent from './RayonArtifactAgent';

// model
import { RayonEvent } from '../../../../shared/token/model/Token';
import { PastLog, PastEvent, FunctionHistory, EventHistory } from '../model/History';

// util
import ContractUtil from '../util/ContractUtil';

class RayonBlockchainAgent {
  private _web3: Web3;

  private _contractInstance: any;
  private _contractAddress: string;

  private _watchEvents: Set<RayonEvent>;

  private _readLastEventBlockNumber: number = 3936470;
  private _readLastFunctionBlockNumber: number = 3936470;

  private _artifactAgent: RayonArtifactAgent;

  constructor(contractAddress: string, watchEvents: Set<RayonEvent>) {
    this._contractAddress = contractAddress;
    this._watchEvents = watchEvents;
    this._artifactAgent = new RayonArtifactAgent(contractAddress);
    this._setWeb3();
    this._getPastLogs();
  }

  private _setWeb3(): void {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private async _getPastLogs(): Promise<void> {
    const latestBlock = await this._web3.eth.getBlock('latest');
    if (this._readLastFunctionBlockNumber === latestBlock.blockNumber) return;
    this._web3.eth.getPastLogs(
      {
        fromBlock: this._readLastFunctionBlockNumber + 1,
        toBlock: latestBlock.blockNumber,
        address: this._contractAddress,
      },
      this._onFetchedPastLogs.bind(this)
    );
  }

  private async _getPastEvents(): Promise<void> {
    const latestBlock = await this._web3.eth.getBlock('latest');
    if (this._readLastFunctionBlockNumber === latestBlock.blockNumber) return;
    this._watchEvents.forEach(eventType => {
      this._contractInstance.getPastEvents(
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
      const functionHistory: FunctionHistory = {
        calledTime: block.timestamp,
        txHash: pastLog.transactionHash,
        contractAddress: pastLog.address,
        functionName: this._artifactAgent.getFunctionFullNameByTopic(pastLog.topics[0]),
        inputData: JSON.stringify(this._artifactAgent.getFunctionParametersByTopic(pastLog.topics[0], parameters)),
      };
    });
  }

  private _onFetchedPastEvents(error, pastEvent: PastEvent[]) {
    console.log('event result', pastEvent);
  }
}

export default RayonBlockchainAgent;
