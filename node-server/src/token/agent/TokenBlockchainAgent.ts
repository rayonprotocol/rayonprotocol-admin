// agent
import RegistryAgent from '../../registry/agent/RegistryAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// util
import ContractUtil from '../../../../shared/common/util/ContractUtil';

class TokenBlockchainAgent {
  private _contractInstance: any;

  constructor() {
    const contractAddr = RegistryAgent.getContractAddrByName('RayonToken');
    this._contractInstance = Web3Controller.getContractInstance(contractAddr);
  }

  public async getTokenCap() {
    return ContractUtil.weiToToken(await this._contractInstance.methods.cap().call());
  }

  public async getTotalSupply() {
    return ContractUtil.weiToToken(await this._contractInstance.methods.totalSupply().call());
  }
}

export default new TokenBlockchainAgent();
