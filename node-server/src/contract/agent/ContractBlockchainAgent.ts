// model
import { newContract } from '../../../../shared/contract/model/Contract';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// util
import ContractUtil from '../../../../shared/common/util/ContractUtil';
import ObjectUtil from '../../../../shared/common/util/ObjectUtil';

class ContractBlockchainAgent {
  private _contractInstance: any;

  constructor() {
    this._contractInstance = Web3Controller.getContractInstance(ContractUtil.ADDR_REGISTRY);
  }

  public async fetchAllContractInfo(): Promise<newContract[]> {
    const contractSize = await this._contractInstance.methods.size().call();
    const contracts = [];
    for (let i = 0; i < contractSize; i++) {
      const resData = await this._contractInstance.methods.getRegistryInfoByIndex(i).call();
      const contract: newContract = {
        name: resData[0],
        proxyAddress: resData[1].toLowerCase(),
        interfaceAddress: resData[2].toLowerCase(),
        version: resData[3],
        blockNumber: resData[4],
        updatedAt: resData[5],
      };
      contracts.push(contract);
    }
    return contracts;
  }

  public async getFirstContractBlockNumber(): Promise<number> {
    const contracts = await this.fetchAllContractInfo();
    if (ObjectUtil.isEmpty(contracts)) {
      const latestBlock = await Web3Controller.getWeb3().eth.getBlock('latest');
      return latestBlock.blockNumber;
    }
    const contract = contracts.reduce((a, b) => (a.blockNumber > b.blockNumber ? b : a));
    return contract.blockNumber;
  }

  public async getContractAddrByName(name: string): Promise<string> {
    const contracts = await this.fetchAllContractInfo();
    const filteredContract = contracts.filter(contract => contract.name === name);
    return filteredContract.length ? filteredContract.pop().proxyAddress : null;
  }
}

export default new ContractBlockchainAgent();
