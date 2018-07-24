import { Express, Request, Response } from 'express';

// dc
import ContractDC from '../../common/dc/ContractDC';

// model
import RayonEvent, {
  TransferArgs,
  TransferEvent,
  BlockTime,
  MintArgs,
  MintEvent,
} from '../../../../shared/event/model/RayonEvent';
import SendResult from '../../../../shared/common/model/SendResult';
import { URLForGetMintEvents, URLForGetTransferEvents } from '../../../../shared/event/model/RayonEvent';

class TokenDC {
  mintEvents: MintEvent[] = [];
  transferEvents: TransferEvent[] = [];

  public configuration(app: Express) {
    app.get(URLForGetMintEvents, this.getMintEvent.bind(this));
    app.get(URLForGetTransferEvents, this.getTransferEvent.bind(this));
  }

  attachTokenMintEvent(instance) {
    const mintEvent = instance.Mint({}, { fromBlock: 0, toBlock: 'latest' });
    mintEvent.watch(this.mintEventHandler.bind(this));
  }

  mintEventHandler(error, event: RayonEvent<MintArgs>) {
    if (error) console.error(error);
    const newEvent: MintEvent = {
      to: event.args.to,
      amount: event.args.amount.toNumber(),
    };

    this.mintEvents.push(newEvent);
    console.log('mintEvents', newEvent);
  }

  getMintEvent(req: Request, res: Response) {
    if (this.mintEvents.length !== 0) {
      const result: SendResult<MintEvent[]> = {
        result_code: 0,
        result_message: 'Success Response Mint Events',
        data: this.mintEvents,
      };
      res.send(result);
    } else {
      const result: SendResult<MintEvent[]> = {
        result_code: 1,
        result_message: 'Fail Response Mint Events',
        data: null,
      };
      res.send(result);
    }
  }

  attachTokenTransferEvent(instance) {
    const transferEvent = instance.Transfer({}, { fromBlock: 0, toBlock: 'latest' });
    transferEvent.watch(this.transferEventHandler.bind(this));
  }

  async transferEventHandler(error, event: RayonEvent<TransferArgs>) {
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

    this.transferEvents.push(newEvent);
    console.log('transferEvents', newEvent);
  }

  getTransferEvent(req, res: Response) {
    if (this.transferEvents.length !== 0) {
      const result: SendResult<TransferEvent[]> = {
        result_code: 0,
        result_message: 'Success Response Transfer Events',
        data: this.transferEvents,
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

  async getBalance() {
    return (await ContractDC.getTokenContractInstance().totalSupply()).toNumber();
  }
}

export default new TokenDC();
