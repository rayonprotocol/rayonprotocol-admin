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
    // const latestBlock = await TokenBlockchainAgent.getBlock('latest');
    // let timestamp;
    // if (latestBlock.number < event.blockNumber) {
    //   timestamp = latestBlock.timestamp;
    // } else {
    //   const block = await TokenBlockchainAgent.getBlock(event.blockNumber);
    //   timestamp = block.timestamp;
    // }

    // console.log('latest Block', latestBlock);
    // console.log('new block', timestamp);

    // const newDate = new Date(timestamp * 1000);
    // const newBlockTime: BlockTime = {
    //   timestamp: timestamp * 1000,
    //   year: newDate.getFullYear(),
    //   month: newDate.getMonth() + 1,
    //   date: newDate.getDate(),
    // };

    const newEvent: TransferEvent = {
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      blockTime: undefined,
      // blockTime: newBlockTime,
      from: event.returnValues.from,
      to: event.returnValues.to,
      amount: parseInt(event.returnValues.value, 10),
    };

    this._events[RayonEvent.Transfer] === undefined
      ? (this._events[RayonEvent.Transfer] = [newEvent])
      : this._events[RayonEvent.Transfer].push(newEvent);

    this.setHolderBalance(newEvent);

    const newHistory: TokenHistory = {
      from: newEvent.from,
      to: newEvent.to,
      amount: newEvent.amount,
      balance: 0,
    };

    this.addTokenHistory(newHistory, newHistory.from);
    this.addTokenHistory(newHistory, newHistory.to);

    // console.log('==========================');
    // console.log('transferEvents\n', newEvent);
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

  public addTokenHistory(history: TokenHistory, balanceAddress: string) {
    if (this._userTokenHistory[balanceAddress] === undefined) {
      history.balance = this._tokenHolders[balanceAddress];
      this._userTokenHistory[balanceAddress] = [history];
    } else {
      history.balance = this._tokenHolders[balanceAddress];
      this._userTokenHistory[balanceAddress].push(history);
    }
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
