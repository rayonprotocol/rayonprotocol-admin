// dc
import ContractDC from 'common/dc/ContractDC';
import TokenServerAgent from 'token/agent/TokenServerAgent';

class TokenDC {
  public mint(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.mint(toAddress, value, { from: ContractDC.getAccount() });
  }

  public transfer(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.transfer(toAddress, value, { from: ContractDC.getAccount() });
  }

  public async fetchTokenTotalBalance() {
    return await TokenServerAgent.fetchTokenTotalBalance();
  }
}

export default new TokenDC();
