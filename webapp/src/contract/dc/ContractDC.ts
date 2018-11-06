// agent
import ContractAgent from 'contract/agent/ContractAgent';
import ContractBlockchainAgent from 'contract/agent/ContractBlockchainAgent';

// model
import { newContract } from '../../../../shared/contract/model/Contract';

// contoller
import Web3Controller from 'common/dc/Web3Controller';

// util
import ObjectUtil from '../../../../shared/common/util/ObjectUtil';

type ContractListener = (contracts: newContract[]) => void;

class ContractDC {
  private _contracts: newContract[];
  private _contractListeners: Set<ContractListener> = new Set<ContractListener>();

  public async getEventLogs(address: string) {
    return await ContractAgent.fetchEventLogs(address);
  }

  public async getFunctionLogs(address: string) {
    return await ContractAgent.fetchFunctionLogs(address);
  }

  public addContractListener(listener: (contracts: newContract[]) => void) {
    this._contractListeners.add(listener);
  }

  public removeContractListener(listener) {
    this._contractListeners.delete(listener);
  }

  public async fetchAllContracts() {
    if (this._contracts === undefined) this._contracts = await ContractBlockchainAgent.fetchAllContractInfo();
    this.onContractsfetched(this._contracts);
  }

  public onContractsfetched(contracts: newContract[]): void {
    this._contractListeners && this._contractListeners.forEach(listener => listener(contracts));
  }

  public getFirstContractAddr(): string {
    if (ObjectUtil.isEmpty(this._contracts)) return null;
    const test = this._contracts.reduce((a, b) => (a.blockNumber > b.blockNumber ? b : a));
    return test.interfaceAddress;
  }

  public setMetamaskLoginListener(listener: (obj) => void) {
    Web3Controller.getWeb3().currentProvider['publicConfigStore'].on('update', listener);
  }

  // To Blockchain agent

  public fetchAllContractInfo() {
    ContractBlockchainAgent.fetchAllContractInfo();
  }

  public registerProxyContract(proxyAddress: string, blockNumber: number) {
    ContractBlockchainAgent.registerProxyContract(proxyAddress, blockNumber);
  }

  public upgradeContract(contractAddress: string[]) {
    ContractBlockchainAgent.upgradeContract(contractAddress);
  }
}

export default new ContractDC();
