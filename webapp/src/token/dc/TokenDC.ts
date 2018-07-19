import ContractDC, { ContractInstance } from 'common/dc/ContractDC';

class TokenDC {
  mintEventListener: (error, event) => void;
  mintEvent;

  transferEventListener: (error, event) => void;
  transferEvent;

  async getTotalBalance() {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    const totalSupply = (await instance.totalSupply()).toNumber();

    return totalSupply;
  }

  transfer(toAddress: string, value: number) {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    instance.transfer(toAddress, value, { from: ContractDC.getAccount() });
  }

  watchTransferEvent() {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    if (this.transferEvent === undefined)
      this.transferEvent = instance.Transfer({}, { fromBlock: 0, toBlock: 'latest' });
    if (this.transferEventListener === undefined) return console.error('mint event listner is undefined');
    this.transferEvent.watch(this.transferEventListener);
  }

  stopWatchTransferEvent() {
    if (this.transferEvent === undefined) return console.error('mint event listner is undefined');
    this.transferEvent.stopWaching();
  }

  setWatchTransferEventListener(listener: (error, event) => void) {
    this.transferEventListener = listener;
  }

  mint(toAddress: string, value: number) {
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
