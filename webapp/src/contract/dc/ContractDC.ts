// agent
import ContractAgent from 'contract/agent/ContractAgent';

class ContractDC {
//   _loginListener: (obj) => void;

  public setMetamaskLoginListener(listener: (obj) => void) {
    ContractAgent.getWeb3().currentProvider['publicConfigStore'].on('update', listener);
  }

  public async setWeb3(): Promise<void> {
    ContractAgent.setWeb3();
  }
  public async getUserAccount(): Promise<string> {
    return ContractAgent.getUserAccount();
  }
}

export default new ContractDC();
