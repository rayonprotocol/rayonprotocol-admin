// model
import { MintEvent, MintArgs } from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';

class MintEventDC extends BasicEventDC<MintEvent, MintArgs> {
  eventHandler(error, event) {
    if (error) console.error(error);
    const newEvent: MintEvent = {
      to: event.args.to,
      amount: event.args.amount.toNumber(),
    };

    this._events.push(newEvent);
    console.log('mintEvents', newEvent);
    this.notifyEvent(this._events);
  }
}

export default MintEventDC;
