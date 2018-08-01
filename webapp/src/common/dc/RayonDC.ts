import { RayonEvent } from '../../../../shared/token/model/Token';

type EventListner = (event) => void;

abstract class RayonDC {
  protected _events: Map<RayonEvent, Array<any>>;
  protected _eventListeners: Map<RayonEvent, Set<EventListener>>;

  constructor() {
    this._events = new Map();
    this._eventListeners = new Map();
  }

  public addEventListener(eventType: number, listner: EventListner) {
    if (this._eventListeners[eventType] === undefined) this._eventListeners[eventType] = new Set();
    this._eventListeners[eventType].add(listner);
  }

  public removeEventListener(eventType: number, listner: EventListner) {
    if (this._eventListeners[eventType] === undefined) return;
    this._eventListeners[eventType].remove(listner);
  }
}

export default RayonDC;
