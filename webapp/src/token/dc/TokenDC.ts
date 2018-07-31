// model
import { RayonEvent } from '../../../../shared/event/model/RayonEvent';

// dc
import ContractDC from 'common/dc/ContractDC';
import TokenServerAgent from 'token/agent/TokenServerAgent';

type Listner = (event) => void;

interface EventListener {
  [eventName: number]: Listner[];
}

class TokenDC {
  _event = {};
  _eventListeners: EventListener = {};

  /*
  for event add, remove, etc.
  */
  public addEventListener(eventType: number, listner: (event) => void) {
    this._eventListeners[eventType] === undefined ? [listner] : this._eventListeners[eventType].push(listner);
  }

  public removeEventListener(eventType: number, listner: (event) => void) {
    const targetIndex = this._eventListeners[eventType].indexOf(listner);
    this._eventListeners[eventType].splice(targetIndex, 1);
  }

  public async fetchEvents(eventType: number, eventListeners: Listner[]) {
    if (this._event[eventType] === undefined) {
      this._event[eventType] = await this._getRequestByEventType(eventType);
    }
    if (this._event[eventType] !== undefined) {
      this._eventListeners[eventType].map(callback => callback(this._event[eventType]));
    }
  }

  private async _getRequestByEventType(eventType: number) {
    switch (eventType) {
      case RayonEvent.Mint:
        return await TokenServerAgent.fetchMintEvents();
      case RayonEvent.Transfer:
        return await TokenServerAgent.fetchTransferEvents();
      default:
        break;
    }
  }

  /*
  Token basic function
  */
  public mint(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.mint(toAddress, value, { from: ContractDC.getAccount() });
  }

  public transfer(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.transfer(toAddress, value, { from: ContractDC.getAccount() });
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
