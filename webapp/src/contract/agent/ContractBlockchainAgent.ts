// controller
import Web3Controller from 'common/dc/Web3Controller';

// model
import { newContract } from '../../../../shared/contract/model/Contract';

// util
import ContractUtil from '../../../../shared/common/util/ContractUtil';

class ContractBlockchainAgent {
  // TODO: 메타 마스크의 첫번째 주소를 사용하도록 변경, 해당 하드 코딩은 테스트용임.
  ownerAddr = '0x63d49dae293ff2f077f5cda66be0df251a0d3290';

  private _contractInstance: any;

  constructor() {
    this._contractInstance = Web3Controller.getContractInstance(ContractUtil.ADDR_REGISTRY);
  }

  public async fetchAllContractInfo() {
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
    console.log('contracts', contracts);
    return contracts;
  }

  public async registerProxyContract(proxyAddress: string, blockNumber: number) {
    await this._contractInstance.methods.register(proxyAddress, blockNumber).send({ from: this.ownerAddr });
  }

  public async upgradeContract(contractAddress: string[]) {
    await this._contractInstance.methods.upgradeAll(contractAddress).send({ from: this.ownerAddr });
  }
}

export default new ContractBlockchainAgent();
