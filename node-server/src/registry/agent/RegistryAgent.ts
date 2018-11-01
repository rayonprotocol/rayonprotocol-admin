// model
import Contract from '../../../../shared/contract/model/Contract';
import ContractUtil from '../../../../shared/common/util/ContractUtil';

class RegistryAgent {

  private _contracts_dev: Contract[] = [
    {
      address: '0x87734414f6fe26c3fff5b3fa69d379be4c0a2056',
      name: 'RayonToken',
      owner: '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290',
      deployedBlockNumber: 0,
    },
  ];

  private _contracts_ropsten: Contract[] = [
    {
      address: '0xf9a8a966d310cb240c4edc98ca43eb7ff1c5d491',
      name: 'RayonToken',
      owner: '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290',
      deployedBlockNumber: 3936488,
    },
  ];

  public getContracts() {
    const env = process.env.ENV_BLOCKCHAIN;
    if (env === ContractUtil.ENV_DEV) return this._contracts_dev;
    else if (env === ContractUtil.ENV_TESTNET) return this._contracts_ropsten;
  }

  public getContractAddrList() {
    const contracts: Contract[] = this.getContracts();
    return contracts.map(contract => contract.address);
  }

  public getContractOwnerAddrList() {
    const contracts: Contract[] = this.getContracts();
    return contracts.map(contract => contract.owner);
  }

  public getContractByAddr(contractAddr: string) {
    const contracts = this.getContracts();
    const targetContract = contracts.filter(contract => contract.address === contractAddr);
    return targetContract.length ? targetContract.pop() : null;
  }

  public getContractAddrByName(contractName: string) {
    const contracts = this.getContracts();
    const targetContract = contracts.filter(contract => contract.name === contractName);
    return targetContract.length ? targetContract.pop().address : null;
  }

  public getFirstContractBlockNumber() {
    const contracts = this.getContracts();
    return Math.min.apply(null, contracts.map(contract => contract.deployedBlockNumber));
  }

  public isRayonContract(contractAddress: string): boolean {
    if (contractAddress === null) return;
    return this.getContractAddrList().indexOf(contractAddress.toLowerCase()) > -1;
  }
}

export default new RegistryAgent();
