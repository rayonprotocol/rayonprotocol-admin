import Web3 from 'web3';
import axios from 'axios';
import TruffleContract from 'truffle-contract';

// model
import SendResult from '../../../../shared/common/model/SendResult';

// util
import getWeb3 from 'common/util/getWeb3';
import { RayonEvent } from '../../../../shared/token/model/Token';

let web3: Web3;
let userAccount: string;

type EventListner = ((eventType: RayonEvent, event: any) => void);

abstract class ContractAgent {
  public static RESULTCODE_SUCCESS: number = 0;
  public static FROM_BLOCK = 'latest';

  private _contract: JSON;
  private _watchEvents: Set<RayonEvent>;
  protected _eventListener: EventListner;
  protected _contractInstance;

  constructor(contract: JSON, watchEvents: Set<RayonEvent>) {
    web3 = getWeb3();
    web3.eth.getAccounts((err, accounts) => {
      userAccount = accounts[0];
    });
    this._contract = contract;
    this._watchEvents = watchEvents;
    this.fetchContractInstance();
  }

  /*
  Must Implement abstract funcion
  */
  public async fetchContractInstance() {
    // ABI가져온 후 TruffleContract 객체 생성
    const contract = TruffleContract(this._contract);
    contract.setProvider(this.getWeb3().currentProvider);

    // Rayon Token의 인스턴스 가져옴
    const instance = await contract.deployed();
    this._contractInstance = instance;
    this.startEventWatch();
  }

  public startEventWatch() {
    const eventRange = this.getEventRange();

    this._watchEvents.forEach(eventType => {
      const targetEventFunction = this._contractInstance[RayonEvent.getRayonEventName(eventType)]({}, eventRange);
      targetEventFunction.watch(this.onEvent.bind(this, eventType));
    });
  }

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
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */
  public setEventListner(listner: EventListner) {
    this._eventListener = listner;
  }

  private onEvent(eventType: RayonEvent, error, event) {
    console.log('event', event);
    if (error) console.error(error);
    this._eventListener && this._eventListener(eventType, event);
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

  public getEventRange() {
    return { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
  }
}

export default ContractAgent;
