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
      this._contractInstance = new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
      console.error(error);
    }
    // console.log('this._contractInstance123123', this._contractInstance);
    this.getPastEvents();
    this.addEventListenerOnBlockchain();
  }

  private getAbiFromArtifact() {
    return this._contract['abi'];
  }

  private getContractAddressFromArtifact() {
    const ROPSTEN_NETWORK_ID = 3;
    return this._contract['networks'][ROPSTEN_NETWORK_ID]['address'];
  }

  protected getPastEvents() {
    this._watchEvents.forEach(eventType => {
      this._contractInstance.getPastEvents(
        RayonEvent.getRayonEventName(eventType),
        this.getEventRange(),
        this.handlePastEventFetched.bind(this, eventType)
      );
    });
  }

  protected handlePastEventFetched(eventType, error, events) {
    events.forEach(event => {
      this.onEvent(eventType, error, event);
    });
  }

  private addEventListenerOnBlockchain() {
    this._watchEvents.forEach(eventType => {
      this._contractInstance.events[RayonEvent.getRayonEventName(eventType)](
        { fromBlock: this.FROM_BLOCK },
        this.onEvent.bind(this, eventType)
      );
    });
  }

  public setEventListner(listner: RayonEventListener) {
    this._eventListener = listner;
  }

  private onEvent(eventType: number, error, event): void {
    // console.log('onEvent', event);
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

  public async getTokenTotalBalance() {
    return await this._contractInstance.methods.totalSupply().call();
  }
}

export default ContractAgent;
