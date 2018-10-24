// util
import ContractUtil from '../../common/util/ContractUtil';
import Web3Controller from '../../common/controller/Web3Controller';

import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import Contract from '../../../../shared/contract/model/Contract';

class TokenBlockchainAgent {
  private _contractInstance: any;

  constructor() {
    const contract = new Contract(process.env.ENV_BLOCKCHAIN);
    const contractAddr = contract.getContractAddrByName(Contract.CONTRACT_RAYONTOKEN);
    this._contractInstance = Web3Controller.getContractInstance(
      ContractUtil.getContract(contractAddr).abi,
      contractAddr
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
