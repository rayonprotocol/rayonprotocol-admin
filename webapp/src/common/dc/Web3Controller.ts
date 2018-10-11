import Web3 from 'web3';

// util
import ContractUtil from 'common/util/ContractUtil';

class Web3Controller {
  private _web3: Web3;

  constructor() {
    this.setWeb3();
  }

  public setWeb3() {
    let browserWeb3: Web3 = (window as any).web3 as Web3;
    typeof browserWeb3 !== 'undefined'
      ? (browserWeb3 = new Web3(browserWeb3.currentProvider))
      : (browserWeb3 = this._web3 = new Web3(ContractUtil.getHttpProvider()));

    this._web3 = browserWeb3;
  }

  public getWeb3() {
    return this._web3;
  }
}

export default new Web3Controller();
