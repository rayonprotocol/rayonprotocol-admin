import ServerAgent from 'common/agent/ServerAgent';

import { URLForGetMintEvents, URLForGetTransferEvents } from '../../../../shared/event/model/RayonEvent';

class EventServerAgent extends ServerAgent {
  async getMintEvents() {
    const mintEvents = await ServerAgent.getItem(URLForGetMintEvents);
    console.log('mintEvents', mintEvents);
    return mintEvents;
  }
}

export default new EventServerAgent();
