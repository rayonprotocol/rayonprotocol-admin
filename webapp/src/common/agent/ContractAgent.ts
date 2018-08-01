import Web3 from 'web3';
import axios from 'axios';

// model
import SendResult from '../../../../shared/common/model/SendResult';

// util
import getWeb3 from 'common/util/getWeb3';

let web3: Web3;
let userAccount: string;

interface EventListner {
  [eventType: number]: ((event) => void)[];
}

abstract class ContractAgent {
  public static RESULTCODE_SUCCESS: number = 0;
  public static FROM_BLOCK = 'latest';

  protected _eventListeners = {};
  protected _contractInstance;

  constructor() {
    web3 = getWeb3();
    web3.eth.getAccounts((err, accounts) => {
      userAccount = accounts[0];
    });
    this.fetchContractInstance();
  }

  protected abstract async fetchContractInstance();

  protected abstract startEventWatch();

  /*
  Get, Post Request function to server
  */
  public async getRequest<T>(url: string, params?: Object): Promise<T> {
    // To server
    const { data } = await axios.get(`${URL_APIBASE}${url}`, { params: params });
    // Return undfined in case of failure
    if (data === undefined || data['result_code'] !== ContractAgent.RESULTCODE_SUCCESS) return undefined;
    else return data['data'];
  }

  public async postRequest<T>(url: string, params?: Object): Promise<SendResult<T>> {
    // To server
    const { data } = await axios.post(`${URL_APIBASE}${url}`, params);
    // Return undfined in case of failure
    return <SendResult<T>>data;
  }

  /*
  Common value getter
  */
  public getWeb3() {
    return web3;
  }

  public getUserAccount() {
    return userAccount;
  }

  public getContractInstance() {
    return this._contractInstance;
  }

  public getEventRange() {
    return { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
  }
}

export default ContractAgent;
