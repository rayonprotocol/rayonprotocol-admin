import TruffleContract from 'truffle-contract';

// agent
import ContractAgent from 'common/agent/ContractAgent';

// model
import {
  URLForGetTokenTotalBalance,
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
  URLForGetMintEvents,
  URLForGetTransferEvents,
  URLForGetTransactionChartData,
  MintEvent,
  TransferEvent,
  ChartData,
  RayonEvent,
} from '../../../../shared/token/model/Token';

class TokenServerAgent extends ContractAgent {
  /*
  Must Implement abstract funcion
  */
  public async fetchContractInstance() {
    // ABI가져온 후 TruffleContract 객체 생성
    const contract = TruffleContract(require('../../../build/contracts/RayonToken.json'));
    contract.setProvider(this.getWeb3().currentProvider);

    // Rayon Token의 인스턴스 가져옴
    const instance = await contract.deployed();
    this._contractInstance = instance;
    this.startEventWatch();
  }

  public startEventWatch() {
    const mintEvent = this._contractInstance.Mint({}, { fromBlock: 'latest', toBlock: 'latest' });
    const transferEvent = this._contractInstance.Transfer({}, { fromBlock: 'latest', toBlock: 'latest' });

    mintEvent.watch(this.onEventOccur.bind(this, RayonEvent.Mint)); // mint 이벤트 watch 등록
    transferEvent.watch(this.onEventOccur.bind(this, RayonEvent.Transfer)); // mint 이벤트 watch 등록
  }

  /*
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */
  public setEventListner(eventType, listner: (event) => void) {
    this._eventListeners[eventType] = listner;
  }

  private onEventOccur(eventType: number, error, event) {
    if (error) console.error(error);
    if (this._eventListeners[eventType] !== undefined) this._eventListeners[eventType](event);
  }

  /*
  Communicate to blockchain
  Excute token basic function
  */

  public mint(toAddress: string, value: number) {
    this._contractInstance.mint(toAddress, value, { from: this.getUserAccount() });
  }

  public transfer(toAddress: string, value: number) {
    this._contractInstance.transfer(toAddress, value, { from: this.getUserAccount() });
  }

  /*
  Communicate to node-server
  Fetch Kind of rayon token event
  */
  async fetchMintEvents() {
    return await this.getRequest<MintEvent[]>(URLForGetMintEvents);
  }

  async fetchTransferEvents() {
    return await this.getRequest<TransferEvent[]>(URLForGetTransferEvents);
  }

  // 토큰의 총 발행량
  async fetchTokenTotalBalance() {
    return await this.getRequest<number>(URLForGetTokenTotalBalance);
  }

  // 토큰 보유자들의 리스트
  async fetchTokenHolders() {
    return await this.getRequest<object>(URLForGetTokenHolders);
  }

  // 상위 10명의 토큰 보유자
  async fetchTop10TokenHolders() {
    return await this.getRequest<object>(URLForGetTop10TokenHolders);
  }

  // Admin page transaction chart에 사용될 데이터(Date 라벨, 트랜잭션 수)
  async fetchChartData() {
    return await this.getRequest<ChartData>(URLForGetTransactionChartData);
  }
}

export default new TokenServerAgent();
