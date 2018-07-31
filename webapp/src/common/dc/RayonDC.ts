interface EventListner {
  [eventType: number]: ((event) => void)[];
}

abstract class RayonDC {
  public _event = {};
  public _eventListeners: EventListner = {};

  constructor() {
    this.start();
  }

  public async start() {
    this.setContractServerAgent(); // set listener and start contract server agent
  }

  public abstract setContractServerAgent();

  /*
  배포된 계약의 인스턴스가 세팅되었는지 확인 하기 위한 리스너 등록, 실행
  초기에 1회 실행됨
  */
  public abstract setDataReadyListner(listener: () => void);

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
