// agent
import EventServerAgent from 'event/agent/EventServerAgent';

// model
import { MintEvent, MintArgs } from '../../../../shared/event/model/RayonEvent';

// dc
import RayonEventDC from 'common/dc/RayonEventDC';

class MintEventDC extends RayonEventDC<MintEvent, MintArgs> {
  async eventHandler(error, event) {
    if (error) console.error(error);
    this._events = await this.fetchMintEvents();
    this.notifyEvent(this._events);
    console.log('mintEvents', event.args);
  }

  /*
  fetch mint event from node-server
  */
  async fetchMintEvents() {
    return await EventServerAgent.fetchMintEvents();
  }
}

export default new MintEventDC();
