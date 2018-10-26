// agent
import UserAgent from 'user/agent/UserAgent';

// controller
import Web3Controller from 'common/dc/Web3Controller';

// model
import Metamask from 'common/model/metamask/Metamask';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

type UserLoginListener = (userAccount: string, networkName: string) => void;

class UserDC {
  private _userAccount: string;
  private _networkId: number;
  private _userLoginListeners: Set<UserLoginListener>;

  constructor() {
    this._userLoginListeners = new Set<UserLoginListener>();
    this._initialize();
  }

  private async _initialize() {
    const loginResult: Metamask = {
      selectedAddress: (await Web3Controller.getWeb3().eth.getAccounts())[0],
      networkVersion: await Web3Controller.getWeb3().eth.net.getId(),
    };

    console.log('_initialize');
    if (!StringUtil.isEmpty(loginResult.selectedAddress) && (await this.isAdminUser(loginResult.selectedAddress))) {
      Web3Controller.setWeb3();
    } else {
      this._setMetamaskLoginListener(this._onUserLoginStatusChanged.bind(this));
    }

    this._onUserLoginStatusChanged(loginResult);
  }

  private _setMetamaskLoginListener(listener: (obj) => void) {
    Web3Controller.getWeb3().currentProvider['publicConfigStore'].on('update', listener);
  }

  public addUserLoginStatusChangeListeners(listener: UserLoginListener): void {
    this._userLoginListeners.add(listener);
  }

  public removeUserLoginStatusChangeListeners(listener: UserLoginListener): void {
    this._userLoginListeners.delete(listener);
  }

  private _onUserLoginStatusChanged(loginResult: Metamask): void {
    this._userAccount = loginResult.selectedAddress;
    this._networkId = loginResult.networkVersion;

    if (!StringUtil.isEmpty(this._userAccount)) this._userAccount = this._userAccount.toLowerCase();

    this._userLoginListeners &&
      this._userLoginListeners.forEach(listener => listener(this._userAccount, this.getNetworkName()));
  }

  public async isAdminUser(userAddress: string) {
    if (userAddress === undefined) return false;

    const adminAddrList = await UserAgent.fetchAllOwner();
    return ArrayUtil.isContainElement(ArrayUtil.makeLowerCase(adminAddrList), userAddress.toLowerCase());
  }

  public getUserAcount() {
    return this._userAccount;
  }

  public getNetworkName() {
    if (this._networkId === 1) return 'Mainnet';
    else if (this._networkId === 3) return 'Ropsten';
    else return 'Local';
  }
}

export default new UserDC();
