// agent
import ContractAgent from 'contract/agent/ContractAgent';

// contoller
import Web3Controller from 'common/dc/Web3Controller';

class ContractDC {
  public setMetamaskLoginListener(listener: (obj) => void) {
    Web3Controller.getWeb3().currentProvider['publicConfigStore'].on('update', listener);
  }

  public async getEventLogs() {
    return await ContractAgent.fetchEventLogs();
  }

  public async getMethodLogs() {
    return await ContractAgent.fetchMethodLogs();
  }
}

export default new ContractDC();
