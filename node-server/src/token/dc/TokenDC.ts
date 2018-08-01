import { Express, Request, Response } from 'express';

// agent
import TokenAgent from '../agent/TokenAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import {
  URLForGetTokenTotalBalance,
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
  URLForGetMintEvents,
  URLForGetTransferEvents,
  URLForGetTransactionChartData,
  RayonEvent,
  RayonEventResponce,
  MintArgs,
  MintEvent,
  TransferArgs,
  TransferEvent,
  BlockTime,
  ChartData,
} from '../../../../shared/token/model/Token';

interface TransferChart {
  [date: string]: number;
}

class TokenDC extends RayonDC {
  private _tokenHolders = {};
  private _chartDate: TransferChart = {};

  protected setAllEventListeners() {
    TokenAgent.setEventListner(RayonEvent.Mint, this.mintEventListener.bind(this));
    TokenAgent.setEventListner(RayonEvent.Transfer, this.transferEventListener.bind(this));
  }

  public configure(app: Express) {
    app.get(URLForGetMintEvents, this.respondMintEvent.bind(this));
    app.get(URLForGetTokenHolders, this.respondTokenHolders.bind(this));
    app.get(URLForGetTransferEvents, this.respondTransferEvent.bind(this));
    app.get(URLForGetTransactionChartData, this.respondChartData.bind(this));
    app.get(URLForGetTokenTotalBalance, this.respondTokenTotalBalance.bind(this));
    app.get(URLForGetTop10TokenHolders, this.respondTop10TokenHolders.bind(this));
  }

  public respondChartData(req: Request, res: Response) {
    const sortedLabelList = Object.keys(this._chartDate).sort();
    const labels = sortedLabelList.length >= 10 ? sortedLabelList.slice(-10) : sortedLabelList;
    const chartData = labels.map(item => this._chartDate[item]);

    const result: SendResult<ChartData> = {
      result_code: 1,
      result_message: 'Fail Response Chart Data',
      data: null,
    };

    if (res.status(200)) {
      result.result_code = 0;
      result.result_message = 'Success Response Chart Data';
      result.data = {
        labels,
        chartData,
      };
    }

    res.send(result);
  }

  /*
  About Mint Event
  */
  public respondMintEvent(req: Request, res: Response) {
    const result: SendResult<MintEvent[]> = {
      result_code: 1,
      result_message: 'Fail Response Mint Events',
      data: null,
    };

    if (res.status(200)) {
      result.result_code = 0;
      result.result_message = 'Success Response Mint Events';
      result.data = this._event[RayonEvent.Mint];
    }

    res.send(result);
  }

  async mintEventListener(event: RayonEventResponce<MintArgs>) {
    const newEvent: MintEvent = {
      to: event.args.to,
      amount: event.args.amount.toNumber(),
    };

    this._event[RayonEvent.Mint] === undefined
      ? (this._event[RayonEvent.Mint] = [newEvent])
      : this._event[RayonEvent.Mint].push(newEvent);
    console.log('==========================');
    console.log('mintEvents\n', newEvent);
  }

  /*
  About Transfer Event
  */

  public respondTransferEvent(req: Request, res: Response) {
    const sortedTransferEvent = this._event[RayonEvent.Transfer].sort(
      (a, b) => b.blockTime.timestamp - a.blockTime.timestamp
    );
    const result: SendResult<TransferEvent[]> = {
      result_code: 1,
      result_message: 'Fail Response Transfer Events',
      data: null,
    };

    if (res.status(200)) {
      result.result_code = 0;
      result.result_message = 'Success Response Transfer Events';
      result.data = sortedTransferEvent;
    }

    res.send(result);
  }

  async transferEventListener(event: RayonEventResponce<TransferArgs>) {
    const block = await TokenAgent.getBlock(event.blockNumber);
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

    this._event[RayonEvent.Transfer] === undefined
      ? (this._event[RayonEvent.Transfer] = [newEvent])
      : this._event[RayonEvent.Transfer].push(newEvent);
    this.setChartData(newEvent);
    this.setHolders(newEvent.from, newEvent.to, newEvent.amount);
    console.log('==========================');
    console.log('transferEvents\n', newEvent);
  }

  setChartData(event: TransferEvent) {
    const dateKey = event.blockTime.year + '&' + event.blockTime.month + '/' + event.blockTime.date;
    this._chartDate[dateKey] = this._chartDate[dateKey] === undefined ? 1 : (this._chartDate[dateKey] += 1);
  }

  /*
    about token balance
  */
  public async respondTokenTotalBalance(req: Request, res: Response) {
    const _tokenBalence = await TokenAgent.getTokenTotalBalance();

    const result: SendResult<number> = {
      result_code: 1,
      result_message: 'Fail Respond Token Total Balance',
      data: null,
    };

    if (res.status(200)) {
      result.result_code = 0;
      result.result_message = 'Success Respond Token Total Balance';
      result.data = _tokenBalence;
    }

    res.send(result);
  }

  /*
    about token holders
  */
  public getHolders() {
    return this._tokenHolders;
  }

  public setHolders(from: string, to: string, amount: number) {
    this._tokenHolders[from] = this._tokenHolders[from] === undefined ? -amount : this._tokenHolders[from] - amount;
    this._tokenHolders[to] = this._tokenHolders[to] === undefined ? amount : this._tokenHolders[to] + amount;
  }

  public async respondTokenHolders(req: Request, res: Response) {
    const result: SendResult<object> = {
      result_code: 1,
      result_message: 'Fail Respond Token Total Balance',
      data: null,
    };

    if (res.status(200)) {
      result.result_code = 0;
      result.result_message = 'Success Respond Token Total Balance';
      result.data = this._tokenHolders;
    }

    res.send(result);
  }

  public async respondTop10TokenHolders(req: Request, res: Response) {
    const top10TokenHolders = {};
    let top10Sum = 0;

    let sortedTokenHolders = Object.keys(this._tokenHolders).sort(
      (a, b) => this._tokenHolders[b] - this._tokenHolders[a]
    );

    sortedTokenHolders = sortedTokenHolders.length > 10 ? sortedTokenHolders.slice(10) : sortedTokenHolders;
    sortedTokenHolders.forEach(item => {
      top10Sum += this._tokenHolders[item];
      top10TokenHolders[item] = this._tokenHolders[item];
    });

    top10TokenHolders['Etc'] =
      sortedTokenHolders.length > 10 ? (await TokenAgent.getTokenTotalBalance()) - top10Sum : 0;

    const result: SendResult<object> = {
      result_code: 1,
      result_message: 'Fail Respond Token Total Balance',
      data: null,
    };

    if (res.status(200)) {
      result.result_code = 0;
      result.result_message = 'Success Respond Token Total Balance';
      result.data = top10TokenHolders;
    }

    res.send(result);
  }
}

export default new TokenDC();
