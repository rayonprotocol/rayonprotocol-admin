import Web3 from 'web3';

// agent
import RayonArtifactAgent from './RayonArtifactAgent';

// model
import { RayonEvent } from '../../../../shared/token/model/Token';

// util
import ContractUtil from '../util/ContractUtil';

class RayonBlockchainAgent {
  private _web3: Web3;

  constructor(constractAddress: string, watchEvents: Set<RayonEvent>) {}

  private _setWeb3() {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

//   private _setTimer() {
//     setInterval(this.getPastEvents.bind(this), ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
//   }
}

export default RayonBlockchainAgent;
