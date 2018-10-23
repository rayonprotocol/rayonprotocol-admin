// util
import ContractUtil from '../../common/util/ContractUtil';
import Web3Controller from '../../common/controller/Web3Controller';

import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class TokenBlockchainAgent {
  private _contractInstance: any;

  constructor() {
    this._contractInstance = Web3Controller.getContractInstance(
      ContractUtil.getContract(ContractConfigure.ADDR_RAYONTOKEN).abi,
      ContractConfigure.ADDR_RAYONTOKEN
    );
  }

  public async getTokenCap() {
    return ContractUtil.weiToToken(await this._contractInstance.methods.cap().call());
  }

  public async getTotalSupply() {
    return ContractUtil.weiToToken(await this._contractInstance.methods.totalSupply().call());
  }
}

export default new TokenBlockchainAgent();
