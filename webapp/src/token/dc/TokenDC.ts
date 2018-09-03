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
    const userAccount: string = TokenServerAgent.getUserAccount();

    // 자신의 트랜잭션인지 확인
    if (event.returnValues.from !== userAccount && event.returnValues.to !== userAccount) return;
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
}

export default new TokenDC();
