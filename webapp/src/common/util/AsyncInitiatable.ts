export default class AsyncInitiatable {

  public readonly initiation;

  constructor() {
    this.initiation = Promise.resolve().then(this.init.bind(this));
  }
  protected init() {
    return Promise.resolve();
  };
}