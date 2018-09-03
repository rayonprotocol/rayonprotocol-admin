import Web3 from 'web3';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

// model
import { RayonEvent } from '../../../../shared/token/model/Token';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// dc
import TokenDC from '../../token/dc/TokenDC';

// util
import ContractUtil from '../util/ContractUtil';

let web3: Web3;

type RayonEventListener = ((eventType: RayonEvent, event: any) => void);

abstract class ContractAgent {
  public FROM_BLOCK = ContractUtil.getContractBlock();

  private _contract: JSON;
  private _watchEvents: Set<RayonEvent>;
  protected _eventListener: RayonEventListener;
  protected _contractInstance;

  constructor(contract: JSON, watchEvents: Set<RayonEvent>) {
    this._contract = contract;
    this._watchEvents = watchEvents;
    this.setWeb3();
    this.fetchContractInstance();
  }

  private setWeb3() {
    const Web3 = require('web3');
    web3 = new Web3(ContractUtil.getProvider());
  }

  protected async fetchContractInstance() {
    const abi = this.getAbiFromArtifact();
    const contractAddress = this.getContractAddressFromArtifact();

    try {
      this._contractInstance = new web3.eth.Contract(abi,contractAddress);
    } catch (error) {
      console.error(error);
    }

    // this.startEventWatch();
  }

  private getAbiFromArtifact() {
    return this._contract['abi'];
  }

  private getContractAddressFromArtifact() {
    const ROPSTEN_NETWORK_ID = 3;
    return this._contract['networks'][ROPSTEN_NETWORK_ID]['address'];
  }

  protected startEventWatch() {
    const eventRange = this.getEventRange();
    this._watchEvents.forEach(eventType => {
      const targetEventFunction = this._contractInstance[RayonEvent.getRayonEventName(eventType)]({}, eventRange);
      targetEventFunction.watch(this.onEvent.bind(this, eventType));
    });
  }

  public setEventListner(listner: RayonEventListener) {
    this._eventListener = listner;
  }

  private onEvent(eventType: number, error, event): void {
    console.log('onEvent', event);
    if (error) {
      console.error(error);
      return;
    }
    this._eventListener && this._eventListener(eventType, event);
  }

  public getWeb3() {
    return web3;
  }

  public getContractInstance() {
    return this._contractInstance;
  }

  public async getBlock(blockNumber) {
    return await web3.eth.getBlock(blockNumber);
  }

  public getEventRange() {
    return { fromBlock: this.FROM_BLOCK, toBlock: 'latest' };
  }
}

export default ContractAgent;
