import { Express, Request, Response } from 'express';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import { URLForGetMintEvents } from '../../../../shared/event/model/RayonEvent';
import RayonEvent, { MintArgs, MintEvent } from '../../../../shared/event/model/RayonEvent';

// dc
import BasicEventDC from './BasicEventDC';

class MintEventDC extends BasicEventDC<MintEvent, MintArgs> {
  public configure(app: Express) {
    app.get(URLForGetMintEvents, this.respondEvent.bind(this));
  }

  async eventHandler(error, event: RayonEvent<MintArgs>) {
    if (error) console.error(error);
    const newEvent: MintEvent = {
      to: event.args.to,
      amount: event.args.amount.toNumber(),
    };

    this._events.push(newEvent);
    console.log('==========================');
    console.log('mintEvents\n', newEvent);
  }

  public respondEvent(req: Request, res: Response) {
    const result: SendResult<MintEvent[]> = {
      result_code: 1,
      result_message: 'Fail Response Mint Events',
      data: null,
    };

    if (res.status(200)) {
      result.result_code = 0;
      result.result_message = 'Success Response Mint Events';
      result.data = this._events;
    }

    res.send(result);
  }
}

export default new MintEventDC();
