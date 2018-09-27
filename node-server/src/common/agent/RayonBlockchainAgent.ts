import Web3 from 'web3';

// agent
import RayonArtifactAgent from './RayonArtifactAgent';

// model
import { RayonEvent } from '../../../../shared/token/model/Token';

// util
import ContractUtil from '../util/ContractUtil';

interface PastLog {
  data: string;
  topics: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
}

class RayonBlockchainAgent {
  private _web3: Web3;

  private _contractInstance: any;
  private _contractAddress: string;

  private _watchEvents: Set<RayonEvent>;
  private _readLastBlockNumber: number;

  private _artifactAgent: RayonArtifactAgent;

  constructor(contractAddress: string, watchEvents: Set<RayonEvent>) {
    this._contractAddress = contractAddress;
    this._watchEvents = watchEvents;
    this._artifactAgent = new RayonArtifactAgent(contractAddress);
    this._setWeb3();
    this._getPastLogs();
  }

  private _setWeb3() {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private _getPastLogs(): void {
    this._web3.eth.getPastLogs(
      {
        fromBlock: this._readLastBlockNumber + 1,
        toBlock: 'latest',
        address: this._contractAddress,
      },
      this._onFetchPastLogs.bind(this)
    );
  }

  private _onFetchPastLogs(error, result: PastLog[]) {
      
  }
}

export default RayonBlockchainAgent;
