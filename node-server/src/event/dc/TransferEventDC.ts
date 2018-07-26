import { Express, Request, Response } from 'express';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import { URLForGetTransferEvents, URLForGetTransactionChartData } from '../../../../shared/event/model/RayonEvent';
import RayonEvent, {
  TransferArgs,
  TransferEvent,
  BlockTime,
  ChartData,
} from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';
import TokenDC from '../../token/dc/TokenDC';
import ContractDC from '../../common/dc/ContractDC';

type TransferChart = {
  [date: string]: number;
};

class MintEventDC extends BasicEventDC<TransferEvent, TransferArgs> {
  _chartDate: TransferChart = {};

  public configure(app: Express) {
    app.get(URLForGetTransferEvents, this.respondEvent.bind(this));
    app.get(URLForGetTransactionChartData, this.respondChartData.bind(this));
  }

  async eventHandler(error, event: RayonEvent<TransferArgs>) {
    if (error) console.error(error);
    const block = await ContractDC.getWeb3().eth.getBlock(event.blockNumber);
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
    this.setChartData(newEvent);
    TokenDC.setHolders(newEvent.from, newEvent.to, newEvent.amount);
    console.log('==========================');
    console.log('transferEvents\n', newEvent);
  }

  public respondEvent(req: Request, res: Response) {
    const sortedTransferEvent = this._events.sort((a, b) => b.blockTime.timestamp - a.blockTime.timestamp);
    if (res.status(200)) {
      const result: SendResult<TransferEvent[]> = {
        result_code: 0,
        result_message: 'Success Response Transfer Events',
        data: sortedTransferEvent,
      };
      res.send(result);
    } else {
      const result: SendResult<TransferEvent[]> = {
        result_code: 1,
        result_message: 'Fail Response Transfer Events',
        data: null,
      };
      res.send(result);
    }
  }

  /*
  about chart data (transaction per day)
  */
  setChartData(event: TransferEvent) {
    const dateKey = event.blockTime.year + '&' + event.blockTime.month + '/' + event.blockTime.date;
    this._chartDate[dateKey] = this._chartDate[dateKey] === undefined ? 1 : (this._chartDate[dateKey] += 1);
  }

  public respondChartData(req: Request, res: Response) {
    const sortedLabelList = Object.keys(this._chartDate).sort();
    const labels = sortedLabelList.length >= 10 ? sortedLabelList.slice(-10) : sortedLabelList;
    const chartData = labels.map(item => this._chartDate[item]);

    if (res.status(200)) {
      const result: SendResult<ChartData> = {
        result_code: 0,
        result_message: 'Success Response Chart Data',
        data: {
          labels,
          chartData,
        },
      };
      res.send(result);
    } else {
      const result: SendResult<ChartData> = {
        result_code: 1,
        result_message: 'Fail Response Chart Data',
        data: null,
      };
      res.send(result);
    }
  }
}

export default new MintEventDC();
