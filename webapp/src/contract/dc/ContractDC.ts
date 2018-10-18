// agent
import ContractAgent from 'contract/agent/ContractAgent';

// contoller
import Web3Controller from 'common/dc/Web3Controller';

class ContractDC {
  public setMetamaskLoginListener(listener: (obj) => void) {
    Web3Controller.getWeb3().currentProvider['publicConfigStore'].on('update', listener);
  }

  public async getEventLogs(address: string) {
    return await ContractAgent.fetchEventLogs(address);
  }

  public async getFunctionLogs(address: string) {
    return await ContractAgent.fetchFunctionLogs(address);
  }

  public async getContractOverview(address: string) {
    return await ContractAgent.fetchContractOverview(address);
  }
}

export default new ContractDC();
