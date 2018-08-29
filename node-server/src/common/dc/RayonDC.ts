import { Response } from 'express';
import { RayonEvent } from '../../../../shared/token/model/Token';

// model
import SendResult from '../../../../shared/common/model/SendResult';

interface EventListner {
  [eventType: number]: ((event) => void)[];
}

abstract class RayonDC {
  public RESULT_CODE_SUCCESS = 0;
  public RESULT_CODE_FAIL = 1;

  protected _events: Map<RayonEvent, Array<any>>;
  protected _eventListeners: Map<RayonEvent, Set<EventListener>>;

  constructor() {
    this._events = new Map();
    this._eventListeners = new Map();
  }

  public addEventListener(eventType: number, listner: (event) => void) {
    if (this._eventListeners[eventType] === undefined) this._eventListeners[eventType] = new Set();
    this._eventListeners[eventType].add(listner);
  }

  public removeEventListener(eventType: number, listner: (event) => void) {
    if (this._eventListeners[eventType] === undefined) return;
    this._eventListeners[eventType].remove(listner);
  }

  public generateResultResponse(responseCode: number, message: string, data: any) {
    const result = {
      result_code: responseCode,
      result_message: message,
      data,
    };
    return result;
  }
}

export default RayonDC;
