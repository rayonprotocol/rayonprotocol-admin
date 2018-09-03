import { promisify } from 'util';
import { Express, Request, Response } from 'express';

// agent
import TokenBlockchainAgent from '../agent/TokenBlockchainAgent';

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
  RayonEventResponse,
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

  constructor() {
    super();
    TokenBlockchainAgent.setEventListner(this.onEvent.bind(this));
  }

  public configure(app: Express) {
    app.get(URLForGetMintEvents, this.respondMintEvent.bind(this));
    app.get(URLForGetTokenHolders, this.respondTokenHolders.bind(this));
    app.get(URLForGetTransferEvents, this.respondTransferEvent.bind(this));
    app.get(URLForGetTransactionChartData, this.respondChartData.bind(this));
    app.get(URLForGetTokenTotalBalance, this.respondTokenTotalBalance.bind(this));
    app.get(URLForGetTop10TokenHolders, this.respondTop10TokenHolders.bind(this));
  }

  private onEvent(eventType: RayonEvent, event: any): void {
    switch (eventType) {
      case RayonEvent.Mint:
        this.onMintEvent(event);
        break;
      case RayonEvent.Transfer:
        this.onTransferEvent(event);
        break;
      default:
        break;
    }
  }

  public respondChartData(req: Request, res: Response) {
    const sortedLabelList = Object.keys(this._chartDate).sort();
    const labels = sortedLabelList.length >= 10 ? sortedLabelList.slice(-10) : sortedLabelList;
    const chartData = labels.map(item => this._chartDate[item]);

    const result: SendResult<Object> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Response Chart Data', { labels, chartData })
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Response Chart Data', null);

    res.send(result);
  }

  /*
  About Mint Event
  */
  public respondMintEvent(req: Request, res: Response) {
    const data = this._events[RayonEvent.Mint];
    const result: SendResult<MintEvent[]> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Response Mint Events', data)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Response Mint Events', null);

    res.send(result);
  }

  onMintEvent(event: RayonEventResponse<MintArgs>) {
    const newEvent: MintEvent = {
      to: event.args.to,
      amount: event.args.amount.toNumber(),
    };

    this._events[RayonEvent.Mint] === undefined
      ? (this._events[RayonEvent.Mint] = [newEvent])
      : this._events[RayonEvent.Mint].push(newEvent);

    console.log('==========================');
    console.log('mintEvents\n', newEvent);
  }

  /*
  About Transfer Event
  */

  public respondTransferEvent(req: Request, res: Response) {
    if (this._events[RayonEvent.Transfer] === undefined) return;
    const sortedTransferEvent = this._events[RayonEvent.Transfer].sort(
      (a, b) => b.blockTime.timestamp - a.blockTime.timestamp
    );

    const result: SendResult<TransferEvent[]> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Response Transfer Events', sortedTransferEvent)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Response Transfer Events', null);

    res.send(result);
  }

  async onTransferEvent(event: RayonEventResponse<TransferArgs>) {
    const block = await TokenBlockchainAgent.getBlock(event.blockNumber);

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

    this._events[RayonEvent.Transfer] === undefined
      ? (this._events[RayonEvent.Transfer] = [newEvent])
      : this._events[RayonEvent.Transfer].push(newEvent);
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
    const _tokenBalence = await TokenBlockchainAgent.getTokenTotalBalance();

    const result: SendResult<number> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token Total Balance', _tokenBalence)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token Total Balance', null);

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
    const result: SendResult<Object> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token Total Balance', this._tokenHolders)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token Total Balance', null);

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
      sortedTokenHolders.length > 10 ? (await TokenBlockchainAgent.getTokenTotalBalance()) - top10Sum : 0;

    const result: SendResult<Object> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token Total Balance', top10TokenHolders)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token Total Balance', null);

    res.send(result);
  }
}

export default new TokenDC();
