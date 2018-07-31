// agent
import ServerAgent from 'common/agent/ServerAgent';

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
import ContractDeployServerAgent from 'common/agent/ContractDeployServerAgent';

type Listner = (event) => void;

interface EventListener {
  [eventName: number]: Listner;
}

class TokenServerAgent extends ServerAgent {
  _eventListeners: EventListener = {};

  /*
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */
  watchEvent() {
    const ryaonTokenInstance = ContractDeployServerAgent.getContractInstance();
    const mintEvent = ryaonTokenInstance.Mint({}, { fromBlock: 'latest', toBlock: 'latest' });
    const transferEvent = ryaonTokenInstance.TransferEvent({}, { fromBlock: 'latest', toBlock: 'latest' });

    mintEvent.watch(this.mintEventHandler.bind(this)); // mint 이벤트 watch 등록
    transferEvent.watch(this.transferEventHandler.bind(this)); // mint 이벤트 watch 등록
  }

  public addEventListner(eventType: number, listner: (event) => void) {
    this._eventListeners[eventType] === undefined ? listner : console.error(eventType + ' event is already exist');
  }

  public removeEventListener(eventType: number) {
    delete this._eventListeners[eventType];
  }

  private mintEventHandler(error, event) {
    if (error) console.error(error);
    if (this._eventListeners[RayonEvent.Mint] !== undefined) this._eventListeners[RayonEvent.Mint](event);
  }

  private transferEventHandler(error, event) {
    if (error) console.error(error);
    if (this._eventListeners[RayonEvent.Transfer] !== undefined) this._eventListeners[RayonEvent.Transfer](event);
  }

  /*
  Communicate to node-server
  Fetch Kind of rayon token event
  */
  async fetchMintEvents() {
    return await ServerAgent.getRequest<MintEvent[]>(URLForGetMintEvents);
  }

  async fetchTransferEvents() {
    return await ServerAgent.getRequest<TransferEvent[]>(URLForGetTransferEvents);
  }

  // 토큰의 총 발행량
  async fetchTokenTotalBalance() {
    return await ServerAgent.getRequest<number>(URLForGetTokenTotalBalance);
  }

  // 토큰 보유자들의 리스트
  async fetchTokenHolders() {
    return await ServerAgent.getRequest<object>(URLForGetTokenHolders);
  }

  // 상위 10명의 토큰 보유자
  async fetchTop10TokenHolders() {
    return await ServerAgent.getRequest<object>(URLForGetTop10TokenHolders);
  }

  // Admin page transaction chart에 사용될 데이터(Date 라벨, 트랜잭션 수)
  async fetchChartData() {
    return await ServerAgent.getRequest<ChartData>(URLForGetTransactionChartData);
  }
}

export default new TokenServerAgent();
