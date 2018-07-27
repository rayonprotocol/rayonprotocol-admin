// agent
import EventServerAgent from 'event/agent/EventServerAgent';

// model
import { TransferEvent, TransferArgs, ChartData } from '../../../../shared/event/model/RayonEvent';

// dc
import ContractDC from 'common/dc/ContractDC';
import RayonEventDC from 'common/dc/RayonEventDC';

class TransferEventDC extends RayonEventDC<TransferEvent, TransferArgs> {
  _chartData: ChartData;

  async eventHandler(error, event) {
    if (error) console.error(error);
    if (event.args.from !== ContractDC.getAccount() && event.args.to !== ContractDC.getAccount()) return; // filtering only my transaction
    this._events = await this.fetchTransferEvents();
    this.notifyEvent(this._events);
    console.log('transferEvents', event.args);
  }

  async fetchChartData(): Promise<ChartData> {
    return await EventServerAgent.fetchChartData();
  }

  async fetchTransferEvents(): Promise<TransferEvent[]> {
    return await EventServerAgent.fetchTransferEvents();
  }
}

export default new TransferEventDC();
