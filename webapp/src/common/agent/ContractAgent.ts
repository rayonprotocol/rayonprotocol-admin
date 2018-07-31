import Web3 from 'web3';
import axios from 'axios';

// model
import SendResult from '../../../../shared/common/model/SendResult';

// util
import getWeb3 from 'common/util/getWeb3';

let web3: Web3;
let userAccount: string;

abstract class RayonContractAgent {
  public static RESULTCODE_SUCCESS: number = 0;

  protected _eventListeners = {};
  protected _contractInstance;

  private dataReadyListner: () => void;

  constructor() {
    web3 = getWeb3();
    web3.eth.getAccounts((err, accounts) => {
      userAccount = accounts[0];
    });
  }

  public abstract eventWatch();

  public abstract async fetchContractInstance();

  /*
  배포된 계약의 인스턴스가 세팅되었는지 확인 하기 위한 리스너 등록, 실행
  초기에 1회 실행됨
  */
  public setDataReadyListner(listener: () => void) {
    this.dataReadyListner = listener;
  }

  protected onDataReady() {
    if (this.dataReadyListner === undefined) {
      console.error('contract ready 리스너가 등록되지 않았습니다.');
      return;
    }
    this.dataReadyListner();
  }

  /*
  Get, Post Request function to server
  */
  public async getRequest<T>(url: string, params?: Object): Promise<T> {
    // To server
    const { data } = await axios.get(`${URL_APIBASE}${url}`, { params: params });
    // Return undfined in case of failure
    if (data === undefined || data['result_code'] !== RayonContractAgent.RESULTCODE_SUCCESS) return undefined;
    else return data['data'];
  }

  public async postRequest<T>(url: string, params?: Object): Promise<SendResult<T>> {
    // To server
    const { data } = await axios.post(`${URL_APIBASE}${url}`, params);
    // Return undfined in case of failure
    return <SendResult<T>>data;
  }

  /*
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
}

export default RayonContractAgent;
