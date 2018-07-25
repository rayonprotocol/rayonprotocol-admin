// dc
import ContractDC from 'common/dc/ContractDC';

class TokenDC {
  _totalBalance: number = 0;

  public getTotalBalance() {
    return this._totalBalance;
  }

  public addTotalBalance(mintedTokenBalance: number) {
    console.log('mintedTokenBalance', mintedTokenBalance);
    this._totalBalance += mintedTokenBalance;
  }

  /*
  For Rayon Token Transfer,
  Include transfer and watch, stop, set Event
  */
  mint(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.mint(toAddress, value, { from: ContractDC.getAccount() });
  }

  /*
  For about Rayon Token Mint,
  Include transfer and watch, stop, set Event
  */

  transfer(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.transfer(toAddress, value, { from: ContractDC.getAccount() });
  }
}

export default new TokenDC();
