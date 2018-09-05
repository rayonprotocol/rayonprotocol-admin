import Web3 from 'web3';
import axios from 'axios';

// model
import SendResult from '../../../../shared/common/model/SendResult';

// util
import { RayonEvent } from '../../../../shared/token/model/Token';
import ContractUtil from 'common/util/ContractUtil';

let web3: Web3;

type RayonEventListener = ((eventType: RayonEvent, event: any) => void);

abstract class ContractAgent {
  public static RESULTCODE_SUCCESS: number = 0;
  public static FROM_BLOCK = ContractUtil.getContractDeployedBlock(); // event watch start block

  private _contract: JSON; // json which is including ABI and contract address
  protected _contractInstance;

  private _watchEvents: Set<RayonEvent>;
  protected _eventListener: RayonEventListener;

  constructor(contract: JSON, watchEvents: Set<RayonEvent>) {
    this._contract = contract;
    this._watchEvents = watchEvents;
    this.setWeb3();
    this.fetchContractInstance();
  }

  private setWeb3(): void {
    // let browserWeb3: Web3 = (window as any).web3 as Web3;
    // typeof browserWeb3 !== 'undefined'
    //   ? (browserWeb3 = new Web3(browserWeb3.currentProvider))
    //   : (browserWeb3 = new Web3(ContractUtil.getWebsocketProvider()));

    // web3 = browserWeb3;
    web3 = new Web3(ContractUtil.getWebsocketProvider());
  }

  public async fetchContractInstance() {
    const abi = ContractUtil.getAbiFromArtifact(this._contract);
    const contractAddress = ContractUtil.getContractAddressFromArtifact(this._contract);

    // find rayon token instance on blockchain
    try {
      this._contractInstance = new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
      console.error(error);
    }

    this.addEventListenerOnBlockchain();
  }

  private addEventListenerOnBlockchain() {
    this._watchEvents.forEach(eventType => {
      this._contractInstance.events[RayonEvent.getRayonEventName(eventType)](
        { fromBlock: ContractAgent.FROM_BLOCK },
        this.onEvent.bind(this, eventType)
      );
    });
  }

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

  public setEventListner(listner: RayonEventListener) {
    this._eventListener = listner;
  }

  // when event trigger on blockchain, this handler will occur
  private onEvent(eventType: RayonEvent, error, event): void {
    console.log('event', event);
    if (error) {
      console.error(error);
      return;
    }
    this._eventListener && this._eventListener(eventType, event);
  }

  public getEventRange(): Object {
    return { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
  }

  // TODO: 아래의 메서드들은 TOKEN DC와 성격이 맞지 않으니 이관해야함
  public getWeb3(): Web3 {
    return web3;
  }

  public async getUserAccount(): Promise<string> {
    return (await web3.eth.getAccounts())[0];
  }

  public async getNetworkName(): Promise<string> {
    const networkId = await web3.eth.net.getId();
    if (networkId === 1) return 'Mainnet';
    else if (networkId === 3) return 'Ropsten';
    else return 'Local';
  }
}

export default ContractAgent;
