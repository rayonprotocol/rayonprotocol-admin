// agent
import ContractAgent from 'contract/agent/ContractAgent';

// model
import Contract from '../../../../shared/contract/model/Contract';

// contoller
import Web3Controller from 'common/dc/Web3Controller';

type ContractListener = (contracts: Contract[]) => void;

class ContractDC {
  private _contracts: Contract[];
  private _contractListeners: Set<ContractListener> = new Set<ContractListener>();

  public async getEventLogs(address: string) {
    return await ContractAgent.fetchEventLogs(address);
  }

  public async getFunctionLogs(address: string) {
    return await ContractAgent.fetchFunctionLogs(address);
  }

  public addContractListener(listener: (contracts: Contract[]) => void) {
    this._contractListeners.add(listener);
  }

  public removeContractListener(listener) {
    this._contractListeners.delete(listener);
  }

  public async fetchAllContracts() {
    if (this._contracts === undefined) this._contracts = await ContractAgent.fetchAllContract();
    this.onContractsfetched(this._contracts);
  }

  public onContractsfetched(contracts: Contract[]): void {
    this._contractListeners && this._contractListeners.forEach(listener => listener(contracts));
  }

  public getFirstContractAddr(): string {
    return this._contracts === undefined ? null : this._contracts[0].address;
  }

  public setMetamaskLoginListener(listener: (obj) => void) {
    Web3Controller.getWeb3().currentProvider['publicConfigStore'].on('update', listener);
  }
}

export default new ContractDC();
