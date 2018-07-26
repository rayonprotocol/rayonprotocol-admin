// agent
import EventServerAgent from 'event/agent/EventServerAgent';

// model
import { MintEvent, MintArgs } from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';
import TokenDC from 'token/dc/TokenDC';

class MintEventDC extends BasicEventDC<MintEvent, MintArgs> {
  async eventHandler(error, event) {
    if (error) console.error(error);
    console.log('mintEvents', event.args);

    /*
    TODO: must move to node-server
    */
    TokenDC.addTotalBalance(event.args.amount.toNumber());

    await this.fetchMintEvents();
    this.notifyEvent(this._events);
  }

  /*
  fetch mint event from node-server
  */
  async fetchMintEvents() {
    this._events = await EventServerAgent.fetchMintEvents();
  }
}

export default new MintEventDC();
