// dc
import ContractDC from 'common/dc/ContractDC';

class TokenDC {
  private _totalBalance: number = 0;
  private _tokenHolders = {};

  public getTotalBalance() {
    return this._totalBalance;
  }

  public addTotalBalance(mintedTokenBalance: number) {
    this._totalBalance += mintedTokenBalance;
  }

  public getHolders() {
    return this.getHolders;
  }

  public setHolders(from: string, to: string, amount: number) {
    this._tokenHolders[from] = this._tokenHolders[from] === undefined ? -amount : this._tokenHolders[from] - amount;
    this._tokenHolders[to] = this._tokenHolders[to] === undefined ? amount : this._tokenHolders[to] + amount;
  }

  mint(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.mint(toAddress, value, { from: ContractDC.getAccount() });
  }

  transfer(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.transfer(toAddress, value, { from: ContractDC.getAccount() });
  }
}

export default new TokenDC();
