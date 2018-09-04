// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// dc
import RayonDC from 'common/dc/RayonDC';

// model
import {
  RayonEvent,
  RayonEventResponse,
  TransferEvent,
  TransferArgs,
  MintArgs,
  UserTokenHistory,
} from '../../../../shared/token/model/Token';

class TokenDC extends RayonDC {
  constructor() {
    super();
    TokenServerAgent.setEventListner(this.onEvent.bind(this));
  }

  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.Mint:
        this.onMintEvent(event);
        break;
      case RayonEvent.Transfer:
        this.onTransferEvent(event);
        break;
      default:
        break;
    }
  }

  /*
  server event handler for watch blockchain event
  */
  private async onMintEvent(event: RayonEventResponse<MintArgs>): Promise<void> {
    if (this._eventListeners[RayonEvent.Mint] === undefined) return;
    this._events[RayonEvent.Mint] = await TokenServerAgent.fetchMintEvents();
    this._eventListeners[RayonEvent.Mint].forEach(listner => listner(this._events[RayonEvent.Mint]));
  }

  private async onTransferEvent(event: RayonEventResponse<TransferArgs>): Promise<void> {
    // 자신의 트랜잭션인지 확인
    // const userAccount: string = this.getUserAccount();
    // if (event.returnValues.from !== userAccount && event.returnValues.to !== userAccount) return;

    const fetchedEvents = await TokenServerAgent.fetchTransferEvents();
    this._events[RayonEvent.Transfer] = fetchedEvents;
    this._eventListeners[RayonEvent.Transfer] &&
      this._eventListeners[RayonEvent.Transfer].forEach(listner => listner(this._events[RayonEvent.Transfer]));
  }

  public async fetchTransferEvents(): Promise<TransferEvent[]> {
    return await TokenServerAgent.fetchTransferEvents();
  }
  // 토큰의 총 발행량
  public async fetchTokenTotalBalance(): Promise<number> {
    return await TokenServerAgent.fetchTokenTotalBalance();
  }
  // 토큰 보유자들의 리스트
  public async fetchTokenHolders(): Promise<object> {
    return await TokenServerAgent.fetchTokenHolders();
  }
  // 상위 10명의 토큰 보유자
  public async fetchTop10TokenHolders(): Promise<object> {
    return await TokenServerAgent.fetchTop10TokenHolders();
  }

  // 유저 별 토큰 전송 히스토리
  async fetchTokenHistory(): Promise<UserTokenHistory> {
    return await TokenServerAgent.fetchTokenHistory();
  }

  // TODO: 아래의 메서드들은 TOKEN DC와 성격이 맞지 않으니 이관해야함
  public async getUserAccount(): Promise<string> {
    return await TokenServerAgent.getUserAccount();
  }

  public async getNetworkName(): Promise<string> {
    return await TokenServerAgent.getNetworkName();
  }
}

export default new TokenDC();
