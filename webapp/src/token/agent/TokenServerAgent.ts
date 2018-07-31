// agent
import RayonContractAgent from 'common/agent/RayonContractAgent';

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

class TokenServerAgent extends RayonContractAgent {

  /*
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */
  start(ryaonTokenInstance) {
    const mintEvent = ryaonTokenInstance.Mint({}, { fromBlock: 'latest', toBlock: 'latest' });
    const transferEvent = ryaonTokenInstance.Transfer({}, { fromBlock: 'latest', toBlock: 'latest' });

    mintEvent.watch(this.eventHandler.bind(this, RayonEvent.Mint)); // mint 이벤트 watch 등록
    transferEvent.watch(this.eventHandler.bind(this, RayonEvent.Transfer)); // mint 이벤트 watch 등록
  }

  public setEventListner(eventType, listner: (event) => void) {
    this._eventListeners[eventType] = listner;
  }

  private eventHandler(eventType: number, error, event) {
    if (error) console.error(error);
    this._eventListeners[eventType] && this._eventListeners[eventType](event);
  }

  /*
  Communicate to blockchain
  Excute token basic function
  */

  public mint(toAddress: string, value: number) {
    const instance = ContractDeployServerAgent.getContractInstance();
    instance.mint(toAddress, value, { from: ContractDeployServerAgent.getUserAccount() });
  }

  public transfer(toAddress: string, value: number) {
    const instance = ContractDeployServerAgent.getContractInstance();
    instance.transfer(toAddress, value, { from: ContractDeployServerAgent.getUserAccount() });
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
