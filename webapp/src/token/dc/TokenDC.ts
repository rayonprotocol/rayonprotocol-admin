// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// dc
import RayonDC from 'common/dc/RayonDC';

// model
import { RayonEvent, RayonEventResponce, TransferArgs, MintArgs } from '../../../../shared/event/model/RayonEvent';

class TokenDC extends RayonDC {
  constructor() {
    super(TokenServerAgent);
  }

  public setContractServerAgent() {
    TokenServerAgent.setEventListner(RayonEvent.Mint, this.mintEventHandler.bind(this));
    TokenServerAgent.setEventListner(RayonEvent.Transfer, this.transferEventHandler.bind(this));
  }

  /*
  server event handler for watch blockchain event
  */
  private async mintEventHandler(event: RayonEventResponce<MintArgs>) {
    console.log('mint event', event);
    if (this._eventListeners[RayonEvent.Mint] === undefined) return;
    this._event[RayonEvent.Mint] = await TokenServerAgent.fetchMintEvents();
    this._eventListeners[RayonEvent.Mint].forEach(listner => listner(this._event[RayonEvent.Mint]));
  }

  private async transferEventHandler(event: RayonEventResponce<TransferArgs>) {
    console.log('transfer event', event);
    const userAccount = TokenServerAgent.getUserAccount();

    if (this._eventListeners[RayonEvent.Transfer] === undefined) return;
    if (event.args.from !== userAccount && event.args.to !== userAccount) return; // 자신의 트랜잭션일떄만 새로고침

    this._event[RayonEvent.Transfer] = await TokenServerAgent.fetchTransferEvents();
    this._eventListeners[RayonEvent.Transfer].forEach(listner => listner(this._event[RayonEvent.Transfer]));
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
