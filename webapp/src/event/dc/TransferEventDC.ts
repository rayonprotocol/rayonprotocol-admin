// model
import { TransferEvent, TransferArgs, BlockTime } from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';
import ContractDC from 'common/dc/ContractDC';

class TransferEventDC extends BasicEventDC<TransferEvent, TransferArgs> {
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
    this.notifyEvent(this._events);
  }
}

export default TransferEventDC;
