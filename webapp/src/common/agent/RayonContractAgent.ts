import axios from 'axios';

// model
import SendResult from '../../../../shared/common/model/SendResult';

// controller
import Web3Controller from 'common/dc/Web3Controller';

// util
import ContractUtil from 'common/util/ContractUtil';

abstract class RayonContractAgent {
  public static RESULTCODE_SUCCESS: number = 0;

  private _contract: JSON; // json which is including ABI and contract address
  protected _contractInstance;

  constructor(contract: JSON) {
    this._contract = contract;
    this.fetchContractInstance();
  }

  public async fetchContractInstance() {
    const abi = ContractUtil.getAbiFromArtifact(this._contract);
    const contractAddress = ContractUtil.getContractAddressFromArtifact(this._contract);

    // make contract instance(including api to communicate blockchain)
    try {
      const web3 = Web3Controller.getWeb3();
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
    if (this.isRequestFail(data)) {
      console.error(data['result_message']);
      return undefined;
    } else return data['data'];
  }

  private isRequestFail(responsedData): boolean {
    return responsedData === undefined || responsedData['result_code'] !== RayonContractAgent.RESULTCODE_SUCCESS;
  }
}

export default RayonContractAgent;
