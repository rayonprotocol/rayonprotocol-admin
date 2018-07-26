// agebt
import ServerAgent from 'common/agent/ServerAgent';

// model
import {
  URLForGetMintEvents,
  URLForGetTransferEvents,
  MintEvent,
  TransferEvent,
} from '../../../../shared/event/model/RayonEvent';

class EventServerAgent extends ServerAgent {
  async fetchMintEvents() {
    return await ServerAgent.getRequest<MintEvent[]>(URLForGetMintEvents);
  }

  async fetchTransferEvents() {
    return await ServerAgent.getRequest<TransferEvent>(URLForGetTransferEvents);
  }
}

export default new EventServerAgent();
