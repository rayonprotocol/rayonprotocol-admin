import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// model
import { RayonEvent } from '../../../../shared/token/model/Token';

// dc
import TokenDC from '../../token/dc/TokenDC';

let web3: Web3;

type RayonEventListener = ((eventType: RayonEvent, event: any) => void);

abstract class ContractAgent {
  public static FROM_BLOCK = 0;

  private _contract: JSON;
  private _watchEvents: Set<RayonEvent>;
  protected _eventListener: RayonEventListener;
  protected _contractInstance;

  constructor(contract: JSON, watchEvents: Set<RayonEvent>) {
    const Web3 = require('web3');
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(provider);
    this._contract = contract;
    this._watchEvents = watchEvents;
    this.fetchContractInstance();
  }

  protected async fetchContractInstance() {
    const TruffleContract = require('truffle-contract');

    const contract = TruffleContract(this._contract);
    contract.setProvider(this.getWeb3().currentProvider);
    if (typeof contract.currentProvider.sendAsync !== 'function') {
      contract.currentProvider.sendAsync = function() {
        return contract.currentProvider.send.apply(contract.currentProvider, arguments);
      };
    }
    this._contractInstance = await contract.deployed();
    this.startEventWatch();
  }

  protected startEventWatch() {
    const eventRange = this.getEventRange();

    this._watchEvents.forEach(eventType => {
      const targetEventFunction = this._contractInstance[RayonEvent.getRayonEventName(eventType)]({}, eventRange);
      targetEventFunction.watch(this.onEvent.bind(this, eventType));
    });
  }

  /*
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */
  public setEventListner(listner: RayonEventListener) {
    this._eventListener = listner;
  }

  private onEvent(eventType: RayonEvent, error, event): void {
    // console.log(eventType, error, event);
    if (error) console.error(error);
    this._eventListener && this._eventListener(eventType, event);
  }

  public getWeb3() {
    return web3;
  }

  public getContractInstance() {
    return this._contractInstance;
  }

  public async getBlock(blockNumber: number) {
    return await web3.eth.getBlock(blockNumber);
  }

  public getEventRange() {
    return { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
  }
}

export default ContractAgent;
