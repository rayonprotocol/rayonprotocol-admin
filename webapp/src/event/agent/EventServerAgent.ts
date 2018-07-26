// agent
import ServerAgent from 'common/agent/ServerAgent';

// model
import {
  URLForGetMintEvents,
  URLForGetTransferEvents,
  URLForGetTransactionChartData,
  MintEvent,
  TransferEvent,
  ChartData,
} from '../../../../shared/event/model/RayonEvent';

class EventServerAgent extends ServerAgent {
  async fetchMintEvents() {
    return await ServerAgent.getRequest<MintEvent[]>(URLForGetMintEvents);
  }

  async fetchTransferEvents() {
    return await ServerAgent.getRequest<TransferEvent[]>(URLForGetTransferEvents);
  }

  async fetchChartData() {
    return await ServerAgent.getRequest<ChartData>(URLForGetTransactionChartData);
  }
}

export default new EventServerAgent();
