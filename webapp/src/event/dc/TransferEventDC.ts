// model
import { TransferEvent, TransferArgs, BlockTime } from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';
import ContractDC from 'common/dc/ContractDC';

type TransferChart = {
  [date: string]: number;
};

class TransferEventDC extends BasicEventDC<TransferEvent, TransferArgs> {
  _chartDate: TransferChart = {};

  async eventHandler(error, event) {
    if (error) console.error(error);
    const block = await new Promise<any>((resolve, reject) => {
      ContractDC.getWeb3().eth.getBlock(event.blockNumber, (err, _result) => {
        if (err) reject(err);
        resolve(_result);
      });
    });
    const newDate = new Date(block.timestamp * 1000);
    const newBlockTime: BlockTime = {
      timestamp: block.timestamp * 1000,
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      date: newDate.getDate(),
    };

    const newEvent: TransferEvent = {
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      blockTime: newBlockTime,
      from: event.args.from,
      to: event.args.to,
      amount: event.args.value.toNumber(),
    };

    this._events.push(newEvent);
    this._events.sort((a, b) => a.blockTime.timestamp - b.blockTime.timestamp);
    this.setChartData(newEvent);
    this.notifyEvent(this._events);
  }

  setChartData(event: TransferEvent) {
    const dateKey = event.blockTime.year + '&' + event.blockTime.month + '/' + event.blockTime.date;
    this._chartDate[dateKey] = this._chartDate[dateKey] === undefined ? 1 : this._chartDate[dateKey]++;
  }

  getChartData() {
    const sortedLabelList = Object.keys(this._chartDate).sort();
    const labels = sortedLabelList.length >= 10 ? sortedLabelList.slice(-10) : sortedLabelList;
    const data = labels.map(item => this._chartDate[item]);
    return { labels, data };
  }
}

export default new TransferEventDC();
