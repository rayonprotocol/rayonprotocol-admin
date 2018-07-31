interface EventListner {
  [eventType: number]: ((event) => void)[];
}

abstract class RayonDC {
  protected _event = {};
  protected _eventListeners: EventListner = {};

  /*
  Event listner and server event handler for watch blockchain event
  */
  public addEventListener(eventType: number, listner: (event) => void) {
    this._eventListeners[eventType] === undefined
      ? (this._eventListeners[eventType] = [listner])
      : this._eventListeners[eventType].push(listner);
  }

  public removeEventListener(eventType: number, listner: (event) => void) {
    const targetIndex = this._eventListeners[eventType].indexOf(listner);
    this._eventListeners[eventType].splice(targetIndex, 1);
  }
}

export default RayonDC;
