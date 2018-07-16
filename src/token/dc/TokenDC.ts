import ContractDC, { ContractInstance } from 'common/dc/ContractDC';

// model
import { Mint } from 'token/model/Token';

class TokenDC {
  mintEventListener: (error, event) => void;
  mintEvent;
  async getTotalBalance() {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    const totalSupply = (await instance.totalSupply()).toNumber();

    return totalSupply;
  }

  async transfer(toAddress: string, value: number) {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    await instance.transfer(toAddress, value, { from: ContractDC.getAccount() });
  }

  async mint(toAddress: string, value: number) {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    instance.mint(toAddress, value, { from: ContractDC.getAccount() });
  }

  watchMintEvent() {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    if (this.mintEvent === undefined) this.mintEvent = instance.Mint({}, { fromBlock: 0, toBlock: 'latest' });
    if (this.mintEventListener === undefined) return console.error('mint event listner is undefined');
    this.mintEvent.watch(this.mintEventListener);
  }

  stopWatchMintEvent() {
    if (this.mintEvent === undefined) return console.error('mint event listner is undefined');
    this.mintEvent.stopWaching();
  }

  setWatchMintEventListener(listener: (error, event) => void) {
    this.mintEventListener = listener;
  }
}

export default new TokenDC();
