import Web3 from 'web3';

// util
import ContractUtil from '../../../../shared/common/util/ContractUtil';

class Web3Controller {
  private _web3: Web3;

  constructor() {
    this.setWeb3();
  }

  public setWeb3() {
    let browserWeb3: Web3 = (window as any).web3 as Web3;
    typeof browserWeb3 !== 'undefined'
      ? (browserWeb3 = new Web3(browserWeb3.currentProvider))
      : (browserWeb3 = this._web3 = new Web3(this.getHttpProvider()));

    this._web3 = browserWeb3;
  }

  public getWeb3() {
    return this._web3;
  }

  public getWebsocketProvider() {
    const Web3 = require('web3');
    const url: Object = ContractUtil.getWebsocketUrl(ENV_BLOCKCHAIN);
    return new Web3.providers.WebsocketProvider(url);
  }

  public getHttpProvider() {
    const Web3 = require('web3');
    const url: Object = ContractUtil.getHttpUrl(ENV_BLOCKCHAIN) + ``;
    return new Web3.providers.HttpProvider(url);
  }

  public getCurrentProvider(web3: Web3) {
    if (web3.currentProvider['isMetaMask']) return ContractUtil.PROVIDER_METAMASK;
    if (web3.currentProvider['host'] && web3.currentProvider['host'].indexOf(ContractUtil.PROVIDER_INFURA) !== -1)
      return ContractUtil.PROVIDER_INFURA;
    if (web3.currentProvider['host'] && web3.currentProvider['host'].indexOf(ContractUtil.PROVIDER_LOCALHOST) !== -1)
      return ContractUtil.PROVIDER_LOCALHOST;
    return 'unknown';
  }
}

export default new Web3Controller();
