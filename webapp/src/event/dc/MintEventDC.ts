// agent
import EventServerAgent from 'event/agent/EventServerAgent';

// model
import { MintEvent, MintArgs } from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';
import TokenDC from 'token/dc/TokenDC';

class MintEventDC extends BasicEventDC<MintEvent, MintArgs> {
  eventHandler(error, event) {
    if (error) console.error(error);
    const newEvent: MintEvent = {
      to: event.args.to,
      amount: event.args.amount.toNumber(),
    };
    console.log('mintEvents', newEvent);
    TokenDC.addTotalBalance(newEvent.amount);
    this._events.push(newEvent);
    this.notifyEvent(this._events);
  }

  async getMintEvents() {
    await EventServerAgent.getMintEvents();
  }
}

export default new MintEventDC();
