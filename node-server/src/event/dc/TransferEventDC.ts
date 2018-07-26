import { Express, Request, Response } from 'express';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import { URLForGetTransferEvents } from '../../../../shared/event/model/RayonEvent';
import RayonEvent, { TransferArgs, TransferEvent, BlockTime } from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';
import ContractDC from '../../common/dc/ContractDC';

class MintEventDC extends BasicEventDC<TransferEvent, TransferArgs> {
  public configure(app: Express) {
    app.get(URLForGetTransferEvents, this.getEvent.bind(this));
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
    console.log('transferEvents', newEvent);
  }

  public getEvent(req: Request, res: Response) {
    if (res.status(200)) {
      const result: SendResult<TransferEvent[]> = {
        result_code: 0,
        result_message: 'Success Response Transfer Events',
        data: this._events,
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
}

export default new MintEventDC();
