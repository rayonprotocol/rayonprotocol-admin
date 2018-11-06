// agent
import ContractBlockchainAgent from '../../contract/agent/ContractBlockchainAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// util
import ContractUtil from '../../../../shared/common/util/ContractUtil';

class TokenBlockchainAgent {
  public async getTokenInstance() {
    const contractAddr = await ContractBlockchainAgent.getContractAddrByName('RayonToken');
    return Web3Controller.getContractInstance(contractAddr);
  }

  public async getTokenCap() {
    const contractInstance = await this.getTokenInstance();
    return ContractUtil.weiToToken(await contractInstance.methods.cap().call());
  }

  public async getTotalSupply() {
    const contractInstance = await this.getTokenInstance();
    return ContractUtil.weiToToken(await contractInstance.methods.totalSupply().call());
  }
}

export default new TokenBlockchainAgent();
