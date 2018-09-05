import { promisify } from 'util';
import { Express, Request, Response } from 'express';

// agent
import TokenBlockchainAgent from '../agent/TokenBlockchainAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import {
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
  URLForGetMintEvents,
  URLForGetTransferEvents,
  RayonEvent,
  RayonEventResponse,
  MintArgs,
  MintEvent,
  TransferArgs,
  TransferEvent,
  BlockTime,
  UserTokenHistory,
  TokenHistory,
  URLForGetTokenHistory,
} from '../../../../shared/token/model/Token';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

class TokenDC extends RayonDC {
  private _tokenHolders = new Object();
  private _userTokenHistory: UserTokenHistory = {};

  constructor() {
    super();
    TokenBlockchainAgent.setEventListner(this.onEvent.bind(this));
  }

  public configure(app: Express) {
    app.get(URLForGetMintEvents, this.respondMintEvent.bind(this));
    app.get(URLForGetTokenHolders, this.respondTokenHolders.bind(this));
    app.get(URLForGetTransferEvents, this.respondTransferEvent.bind(this));
    app.get(URLForGetTop10TokenHolders, this.respondTop10TokenHolders.bind(this));
    app.get(URLForGetTokenHistory, this.respondTokenHistory.bind(this));
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
      to: event.returnValues.to,
      amount: event.returnValues.amount,
    };

    this._events[RayonEvent.Mint] === undefined
      ? (this._events[RayonEvent.Mint] = [newEvent])
      : this._events[RayonEvent.Mint].push(newEvent);

    // console.log('==========================');
    // console.log('mintEvents\n', newEvent);
  }

  /*
  About Transfer Event
  */

  public respondTransferEvent(req: Request, res: Response) {
    if (this._events[RayonEvent.Transfer] === undefined) return;
    const sortedTransferEvent = this._events[RayonEvent.Transfer].sort((a, b) => b.blockNumber - a.blockNumber);

    const result: SendResult<TransferEvent[]> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Response Transfer Events', sortedTransferEvent)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Response Transfer Events', null);

    res.send(result);
  }

  // TODO: 메서드 분리하여 세분화 해야함
  async onTransferEvent(event: RayonEventResponse<TransferArgs>) {
    let newEventBlock;
    let flag = 0;

    newEventBlock = await TokenBlockchainAgent.getBlock(event.blockNumber);

    while (newEventBlock === undefined || newEventBlock === null) {
      this.wait(1000);
      newEventBlock = await TokenBlockchainAgent.getBlock(event.blockNumber);
      flag++;
      if (flag > 10) newEventBlock = await TokenBlockchainAgent.getBlock('latest');
    }

    const newDate = new Date(newEventBlock.timestamp * 1000);
    const newBlockTime: BlockTime = {
      timestamp: newEventBlock.timestamp * 1000,
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      date: newDate.getDate(),
    };

    const newEvent: TransferEvent = {
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      blockTime: newBlockTime,
      from: event.returnValues.from,
      to: event.returnValues.to,
      amount: parseInt(event.returnValues.value, 10),
    };

    this._events[RayonEvent.Transfer] === undefined
      ? (this._events[RayonEvent.Transfer] = [newEvent])
      : this._events[RayonEvent.Transfer].push(newEvent);

    this.setHolderBalance(newEvent);

    this.addTokenHistory(newEvent);

    // console.log('==========================');
    // console.log('transferEvents\n', newEvent);
  }

  wait(ms) {
    let start = Date.now(),
      now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }

  /*
    about token holders
  */
  public getHolders() {
    return this._tokenHolders;
  }

  public setHolderBalance(newEvent: TransferEvent) {
    this._tokenHolders[newEvent.from] =
      this._tokenHolders[newEvent.from] === undefined
        ? newEvent.amount
        : this._tokenHolders[newEvent.from] - newEvent.amount;
    this._tokenHolders[newEvent.to] =
      this._tokenHolders[newEvent.to] === undefined
        ? newEvent.amount
        : this._tokenHolders[newEvent.to] + newEvent.amount;
  }

  public addTokenHistory(transferEvent: TransferEvent) {
    const fromHistory: TokenHistory = this.getNewTokenHistory(transferEvent, this._tokenHolders[transferEvent.from]);
    const toHistory: TokenHistory = this.getNewTokenHistory(transferEvent, this._tokenHolders[transferEvent.to]);

    if (ArrayUtil.isEmpty(this._userTokenHistory[transferEvent.from]))
      this._userTokenHistory[transferEvent.from] = new Array<TokenHistory>();
    if (ArrayUtil.isEmpty(this._userTokenHistory[transferEvent.to]))
      this._userTokenHistory[transferEvent.to] = new Array<TokenHistory>();

    this._userTokenHistory[transferEvent.from].push(fromHistory);
    this._userTokenHistory[transferEvent.to].push(toHistory);
  }

  public getNewTokenHistory(transferEvent: TransferEvent, balance: number) {
    return {
      from: transferEvent.from,
      to: transferEvent.to,
      amount: transferEvent.amount,
      balance,
    };
  }

  public async respondTokenHolders(req: Request, res: Response) {
    const result: SendResult<Object> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token Total Balance', this._tokenHolders)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token Total Balance', null);

    res.send(result);
  }

  public async respondTop10TokenHolders(req: Request, res: Response) {
    const top10TokenHolders = await this.adjustTop10TokenHolders();

    const result: SendResult<Object> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Top 10 Token Holders', top10TokenHolders)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Top 10 Token Holders', null);

    res.send(result);
  }

  public async adjustTop10TokenHolders() {
    const top10TokenHolders = {};
    let top10TotalBalance = 0;

    let sortedTokenHolders = Object.keys(this._tokenHolders).sort(
      (prev, post) => this._tokenHolders[post] - this._tokenHolders[prev]
    );

    sortedTokenHolders = sortedTokenHolders.length > 10 ? sortedTokenHolders.slice(10) : sortedTokenHolders;
    sortedTokenHolders.forEach(item => {
      if (item === '0x0000000000000000000000000000000000000000') {
        top10TotalBalance -= this._tokenHolders[item];
        return;
      }
      top10TotalBalance += this._tokenHolders[item];
      top10TokenHolders[item] = this._tokenHolders[item];
    });

    top10TokenHolders['Etc'] =
      sortedTokenHolders.length > 10 ? (await TokenBlockchainAgent.getTokenTotalBalance()) - top10TotalBalance : 0;

    return top10TokenHolders;
  }

  public respondTokenHistory(req: Request, res: Response) {
    const result: SendResult<Object> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token History', this._userTokenHistory)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token History', null);

    res.send(result);
  }
}

export default new TokenDC();
