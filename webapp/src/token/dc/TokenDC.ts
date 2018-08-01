// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// dc
import RayonDC from 'common/dc/RayonDC';

// model
import { RayonEvent, RayonEventResponse, TransferArgs, MintArgs } from '../../../../shared/token/model/Token';

class TokenDC extends RayonDC {
  constructor() {
    super();
    TokenServerAgent.setEventListner(this.onEvent.bind(this));
  }

  private onEvent(eventType: RayonEvent, event: any) {
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
  private async onMintEvent(event: RayonEventResponse<MintArgs>) {
    if (this._eventListeners[RayonEvent.Mint] === undefined) return;
    this._events[RayonEvent.Mint] = await TokenServerAgent.fetchMintEvents();
    this._eventListeners[RayonEvent.Mint].forEach(listner => listner(this._events[RayonEvent.Mint]));
  }

  private async onTransferEvent(event: RayonEventResponse<TransferArgs>) {
    const userAccount: string = TokenServerAgent.getUserAccount();

    // 자신의 트랜잭션인지 확인
    if (event.args.from !== userAccount && event.args.to !== userAccount) return;

    const fetchedEvents = await TokenServerAgent.fetchTransferEvents();
    this._events[RayonEvent.Transfer] = fetchedEvents;
    this._eventListeners[RayonEvent.Transfer] &&
      this._eventListeners[RayonEvent.Transfer].forEach(listner => listner(this._events[RayonEvent.Transfer]));
  }

  /*
  Token basic function
  */
  public mint(toAddress: string, value: number) {
    TokenServerAgent.mint(toAddress, value);
  }

  public transfer(toAddress: string, value: number) {
    TokenServerAgent.transfer(toAddress, value);
  }

  public async fetchTokenTotalBalance() {
    return await TokenServerAgent.fetchTokenTotalBalance();
  }
  public async fetchTokenHolders() {
    return await TokenServerAgent.fetchTokenHolders();
  }
  public async fetchTop10TokenHolders() {
    return await TokenServerAgent.fetchTop10TokenHolders();
  }
  public async fetchChartData() {
    return await TokenServerAgent.fetchChartData();
  }
}

export default new TokenDC();
