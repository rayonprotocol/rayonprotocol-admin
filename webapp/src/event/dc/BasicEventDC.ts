// model
import RayonEvent from '../../../../shared/event/model/RayonEvent';

type Listner = (event) => void;

interface EventListener {
  [componentName: string]: Listner;
}

abstract class BasicEventDC<EventResultType, EventArgType> {
  _fromBlock = 0;
  _eventListeners: EventListener = {};
  _events: EventResultType[] = [];

  attachTokenEvent(instanceEvent: Function) {
    const event = instanceEvent({}, { fromBlock: 'latest', toBlock: 'latest' });
    event.watch(this.eventHandler.bind(this));
  }

  // Must Override this function
  abstract async eventHandler(error, event: RayonEvent<EventArgType>);

  notifyEvent(events: EventResultType[]) {
    const keys = Object.keys(this._eventListeners);
    keys.forEach(item => this._eventListeners[item](events));
  }

  subscribeEvent(componentName: string, listener: (events: EventResultType[]) => void) {
    this._eventListeners[componentName] === undefined
      ? (this._eventListeners[componentName] = listener)
      : console.error('Listener ' + componentName + ' is already Existing, check your code');
  }

  unsubscribeEvent(componentName: string) {
    this._eventListeners[componentName] === undefined
      ? console.error('Listener ' + componentName + ' is undefined, check your code')
      : delete this._eventListeners[componentName];
  }
}

export default BasicEventDC;
