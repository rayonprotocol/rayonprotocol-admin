import { promisify } from 'util';
import { BigNumber } from 'bignumber.js';
import { Express, Request, Response } from 'express';

// agent
// import TokenServerAgent from '../agent/TokenServerAgent';
import TokenBlockchainAgent from '../agent/TokenBlockchainAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import {
  URLForGetTokenHolders,
  URLForGetMintEvents,
  URLForGetTransferEvents,
  URLForGetTokenCap,
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
  URLForGetTokenTotalSupply,
} from '../../../../shared/token/model/Token';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import ContractUtil from '../../common/util/ContractUtil';

type TokenHolders = {
  [holders: string]: BigNumber;
};

class TokenDC extends RayonDC {
  constructor() {
    super();
    TokenBlockchainAgent;
  }

  public configure(app: Express) {}

  // private _tokenHolders: TokenHolders = {};
  // private _userTokenHistory: UserTokenHistory = {};

  // constructor() {
  //   super();
  //   TokenServerAgent.setEventListner(this.onEvent.bind(this));
  // }

  // public configure(app: Express) {
  //   app.get(URLForGetMintEvents, this.respondMintEvent.bind(this));
  //   app.get(URLForGetTokenHolders, this.respondTokenHolders.bind(this));
  //   app.get(URLForGetTransferEvents, this.respondTransferEvent.bind(this));
  //   app.get(URLForGetTokenHistory, this.respondTokenHistory.bind(this));
  //   app.get(URLForGetTokenTotalSupply, this.respondTotalSupply.bind(this));
  //   app.get(URLForGetTokenCap, this.respondTokenCap.bind(this));
  //   TokenServerAgent.setTokenCap();
  // }

  // public respondMintEvent(req: Request, res: Response) {
  //   const data = this._events[RayonEvent.Mint];
  //   const result: SendResult<MintEvent[]> = res.status(200)
  //     ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Response Mint Events', data)
  //     : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Response Mint Events', null);

  //   res.send(result);
  // }

  // public respondTransferEvent(req: Request, res: Response) {
  //   if (this._events[RayonEvent.Transfer] === undefined) return;
  //   const sortedTransferEvent = this._events[RayonEvent.Transfer].sort((a, b) => b.blockNumber - a.blockNumber);

  //   const result: SendResult<TransferEvent[]> = res.status(200)
  //     ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Response Transfer Events', sortedTransferEvent)
  //     : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Response Transfer Events', null);

  //   res.send(result);
  // }

  // public async respondTokenHolders(req: Request, res: Response) {
  //   const result: SendResult<Object> = res.status(200)
  //     ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token Holders', this._tokenHolders)
  //     : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token Holders', null);

  //   res.send(result);
  // }

  // public respondTokenHistory(req: Request, res: Response) {
  //   // const sortedTokenHistory = this._getSortedTokenHistory();
  //   const result: SendResult<Object> = res.status(200)
  //     ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token History', this._userTokenHistory)
  //     : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token History', null);

  //   res.send(result);
  // }

  // public async respondTotalSupply(req: Request, res: Response) {
  //   const totalSupply: BigNumber = await TokenServerAgent.getTokenTotalBalance();
  //   const result: SendResult<BigNumber> = res.status(200)
  //     ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Total Supply', totalSupply.toString())
  //     : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Total Supply', null);

  //   res.send(result);
  // }

  // public async respondTokenCap(req: Request, res: Response) {
  //   const tokenCap: BigNumber = await TokenServerAgent.getTokenCap();
  //   const result: SendResult<BigNumber> = res.status(200)
  //     ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token Cap', tokenCap.toString())
  //     : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token Cap', null);

  //   res.send(result);
  // }

  // private onEvent(eventType: RayonEvent, event: any): void {
  //   switch (eventType) {
  //     case RayonEvent.Mint:
  //       this.onMintEvent(event);
  //       break;
  //     case RayonEvent.Transfer:
  //       this.onTransferEvent(event);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // onMintEvent(event: RayonEventResponse<MintArgs>) {
  //   const newEvent: MintEvent = {
  //     to: event.returnValues.to,
  //     amount: event.returnValues.amount,
  //   };

  //   ArrayUtil.isEmpty(this._events[RayonEvent.Mint])
  //     ? (this._events[RayonEvent.Mint] = [newEvent])
  //     : this._events[RayonEvent.Mint].push(newEvent);

  //   TokenServerAgent.setTokenTotalBalance();
  //   // console.log('==========================');
  //   // console.log('mintEvents\n', newEvent);
  // }

  // // TODO: 메서드 분리하여 세분화 해야함
  // onTransferEvent(event: RayonEventResponse<TransferArgs>) {
  //   let newEventBlock;

  //   newEventBlock = TokenServerAgent.getBlock(event.blockNumber);

  //   const newDate = new Date(newEventBlock.timestamp * 1000);
  //   const newBlockTime: BlockTime = {
  //     timestamp: newEventBlock.timestamp * 1000,
  //     year: newDate.getFullYear(),
  //     month: newDate.getMonth() + 1,
  //     date: newDate.getDate(),
  //   };
  //   console.log('event.returnValues.value', event.returnValues.value);

  //   const newEvent: TransferEvent = {
  //     txHash: event.transactionHash,
  //     blockNumber: event.blockNumber,
  //     blockTime: newBlockTime,
  //     from: event.returnValues.from,
  //     to: event.returnValues.to,
  //     amount: ContractUtil.weiToToken(event.returnValues.value),
  //   };

  //   ArrayUtil.isEmpty(this._events[RayonEvent.Transfer])
  //     ? (this._events[RayonEvent.Transfer] = [newEvent])
  //     : this._events[RayonEvent.Transfer].push(newEvent);

  //   this._setHolderBalance(newEvent);
  //   this._addTokenHistory(newEvent);

  //   // console.log('==========================');
  //   // console.log('transferEvents\n', newEvent);
  // }

  // private _setHolderBalance(newEvent: TransferEvent) {
  //   this._tokenHolders[newEvent.from] =
  //     this._tokenHolders[newEvent.from] === undefined
  //       ? newEvent.amount
  //       : this._tokenHolders[newEvent.from].minus(newEvent.amount);
  //   this._tokenHolders[newEvent.to] =
  //     this._tokenHolders[newEvent.to] === undefined
  //       ? newEvent.amount
  //       : this._tokenHolders[newEvent.to].plus(newEvent.amount);
  // }

  // private _addTokenHistory(transferEvent: TransferEvent) {
  //   const fromHistory: TokenHistory = this._makeNewTokenHistory(transferEvent, this._tokenHolders[transferEvent.from]);
  //   const toHistory: TokenHistory = this._makeNewTokenHistory(transferEvent, this._tokenHolders[transferEvent.to]);

  //   if (ArrayUtil.isEmpty(this._userTokenHistory[transferEvent.from]))
  //     this._userTokenHistory[transferEvent.from] = new Array<TokenHistory>();
  //   if (ArrayUtil.isEmpty(this._userTokenHistory[transferEvent.to]))
  //     this._userTokenHistory[transferEvent.to] = new Array<TokenHistory>();

  //   this._userTokenHistory[transferEvent.from].push(fromHistory);
  //   this._userTokenHistory[transferEvent.to].push(toHistory);
  // }

  // private _makeNewTokenHistory(transferEvent: TransferEvent, balance: BigNumber) {
  //   return {
  //     from: transferEvent.from,
  //     to: transferEvent.to,
  //     amount: transferEvent.amount,
  //     balance,
  //     blockTime: transferEvent.blockTime,
  //   };
  // }
}

export default new TokenDC();
