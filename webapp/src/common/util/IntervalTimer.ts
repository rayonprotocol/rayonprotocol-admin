class IntervalTimer {
  private _interval;
  private _timerId;

  constructor(interval: number) {
    this._interval = interval;
  }

  public startIntervalTimer(callback: Function) {
    this._timerId = setInterval(this._interval, callback);
  }

  public clear() {
    clearInterval(this._timerId);
  }
}

export default IntervalTimer;
