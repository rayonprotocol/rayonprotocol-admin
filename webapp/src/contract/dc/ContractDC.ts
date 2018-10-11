// agent
import ContractAgent from 'contract/agent/ContractAgent';

class ContractDC {
  public setMetamaskLoginListener(listener: (obj) => void) {
    ContractAgent.getWeb3().currentProvider['publicConfigStore'].on('update', listener);
  }

  public async setWeb3(): Promise<void> {
    ContractAgent.setWeb3();
  }

  public async getUserAccount(): Promise<string> {
    return ContractAgent.getUserAccount();
  }

  public async fetchEventLogs() {
    return await this.fetchEventLogs();
  }

  public async fetchMethodLogs() {
    return await this.fetchMethodLogs();
  }
}

export default new ContractDC();
