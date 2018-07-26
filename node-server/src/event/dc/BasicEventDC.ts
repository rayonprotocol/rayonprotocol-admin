import { Express, Request, Response } from 'express';

// model
import RayonEvent from '../../../../shared/event/model/RayonEvent';

abstract class BasicEventDC<EventResultType, EventArgType> {
  _fromBlock = 0;
  _events: EventResultType[] = [];

  public abstract configure(app: Express);

  attachTokenEvent(instanceEvent: Function) {
    const event = instanceEvent({}, { fromBlock: this._fromBlock, toBlock: 'latest' });
    event.watch(this.eventHandler.bind(this));
  }

  // Must Override this function
  abstract async eventHandler(error, event: RayonEvent<EventArgType>);

  public abstract getEvent(req: Request, res: Response);
}

export default BasicEventDC;
