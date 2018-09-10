import Web3 from 'web3';
import axios from 'axios';

// model
import SendResult from '../../../../shared/common/model/SendResult';

// util
import ContractUtil from 'common/util/ContractUtil';

let web3: Web3;

abstract class RayonContractAgent {
  public static RESULTCODE_SUCCESS: number = 0;

  private _contract: JSON; // json which is including ABI and contract address
  protected _contractInstance;

  constructor(contract: JSON) {
    this._contract = contract;
    this.setWeb3();
    this.fetchContractInstance();
  }

  public setWeb3(): void {
    let browserWeb3: Web3 = (window as any).web3 as Web3;
    typeof browserWeb3 !== 'undefined'
      ? (browserWeb3 = new Web3(browserWeb3.currentProvider))
      : (browserWeb3 = web3 = new Web3(ContractUtil.getHttpProvider()));

    web3 = browserWeb3;

    // web3 = new Web3(ContractUtil.getWebsocketProvider());
    // web3 = new Web3(ContractUtil.getHttpProvider());
  }

  public async fetchContractInstance() {
    const abi = ContractUtil.getAbiFromArtifact(this._contract);
    const contractAddress = ContractUtil.getContractAddressFromArtifact(this._contract);

    // make contract instance(including api to communicate blockchain)
    try {
      this._contractInstance = new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
      console.error(error);
    }
  }

  public async postRequest<T>(url: string, params?: Object): Promise<SendResult<T>> {
    const { data } = await axios.post(`${URL_APIBASE}${url}`, params);
    return <SendResult<T>>data;
  }

  public async getRequest<T>(url: string, params?: Object): Promise<T> {
    const { data } = await axios.get(`${URL_APIBASE}${url}`, { params: params });
    if (this.isRequestFail(data)) return undefined;
    else return data['data'];
  }

  private isRequestFail(responsedData): boolean {
    return responsedData === undefined || responsedData['result_code'] !== RayonContractAgent.RESULTCODE_SUCCESS;
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

export default RayonContractAgent;
