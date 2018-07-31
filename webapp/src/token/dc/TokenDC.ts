// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// model
import { RayonEvent } from '../../../../shared/event/model/RayonEvent';

// dc
import ContractDeployServerAgent from 'common/agent/ContractDeployServerAgent';

class TokenDC {
  _event = {};
  _eventListeners = {};

  /*
  Event listner and server event handler for watch blockchain event
  */
  public addEventListener(eventType: number, listner: (event) => void) {
    this._eventListeners[eventType] === undefined
      ? (this._eventListeners[eventType] = [listner])
      : this._eventListeners[eventType].push(listner);
  }

  public removeEventListener(eventType: number, listner: (event) => void) {
    const targetIndex = this._eventListeners[eventType].indexOf(listner);
    this._eventListeners[eventType].splice(targetIndex, 1);
  }

  public registTokenListenerToAgent() {
    TokenServerAgent.addEventListner(RayonEvent.Mint, this.mintEventHandler.bind(this));
    TokenServerAgent.addEventListner(RayonEvent.Transfer, this.transferEventHandler.bind(this));
  }

  private async mintEventHandler(event) {
    if (this._eventListeners[RayonEvent.Mint] === undefined) return;
    this._event[RayonEvent.Mint] = await TokenServerAgent.fetchMintEvents();
    this._eventListeners[RayonEvent.Mint].forEach(listner => listner(this._event[RayonEvent.Mint]));
  }

  private async transferEventHandler(event) {
    const userAccount = ContractDeployServerAgent.getUserAccount();

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
