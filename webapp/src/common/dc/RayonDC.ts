import ContractAgent from 'common/agent/ContractAgent';

interface EventListner {
  [eventType: number]: ((event) => void)[];
}

abstract class RayonDC {
  protected _event = {};
  protected _eventListeners: EventListner = {};
  protected _contractAgent: ContractAgent;

  protected _dataReadyListner: () => void;

  constructor(serverAgent: ContractAgent) {
    this._contractAgent = serverAgent;
  }

  /*
  배포된 계약의 인스턴스가 세팅되었는지 확인 하기 위한 리스너 등록, 실행
  초기에 1회 실행됨
  */
  public setDataReadyListner(listener: () => void) {
    this._dataReadyListner = listener;
    this._contractAgent.setDataReadyListner(this.onInstanceReady.bind(this));
  }

  public fetchContractInstance() {
    this._contractAgent.fetchContractInstance();
  }

  public onInstanceReady() {
    this.setContractServerAgent();
    this._contractAgent.eventWatch();
    this._dataReadyListner();
  }

  public abstract setContractServerAgent();

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
