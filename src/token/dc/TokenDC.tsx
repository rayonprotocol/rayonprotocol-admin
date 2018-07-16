import ContractDC, { ContractInstance } from 'common/dc/ContractDC';

class TokenDC {
  async getTotalBalance() {
    const instance = ContractDC.getInstance(ContractInstance.RayonTokenInstance);
    const totalSupply = await instance.totalSupply();

    console.log('totalSupply', totalSupply.toNumber());
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
}

export default new TokenDC();
