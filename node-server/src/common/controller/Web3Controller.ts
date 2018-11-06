import Web3 from 'web3';

import ContractUtil from '../../../../shared/common/util/ContractUtil';

class Web3Controller {
  private _web3: Web3;

  constructor() {
    const Web3 = require('web3');
    this._web3 = new Web3(this.getHttpProvider());
  }

  public getWeb3() {
    return this._web3;
  }

  public getContractInstance(contractAddress: string) {
    return new this._web3.eth.Contract(
      ContractUtil.getContractArtifact(process.env.ENV_BLOCKCHAIN, contractAddress).abi,
      contractAddress
    );
  }

  public getHttpProvider() {
    const Web3 = require('web3');
    const url: Object = ContractUtil.getHttpUrl(process.env.ENV_BLOCKCHAIN);
    return new Web3.providers.HttpProvider(url);
  }
}

export default new Web3Controller();
