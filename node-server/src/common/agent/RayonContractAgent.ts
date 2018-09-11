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
import { Block } from 'web3/types';

let web3: Web3;

let blockChcekFlag: number = 0;

type RayonEventListener = ((eventType: RayonEvent, event: any) => void);

abstract class RayonContractAgent {
  public FROM_BLOCK = ContractUtil.getContractDeployedBlock();

  private _lastReadedBlockNumber: number = ContractUtil.getContractDeployedBlock();
  private _latestBlockNumber: number;
  private _totalTokenSupply: number;
  private _tokenCap: number;

  private _contract: JSON;
  private _watchEvents: Set<RayonEvent>;
  protected _eventListener: RayonEventListener;
  protected _contractInstance: any;

  constructor(contract: JSON, watchEvents: Set<RayonEvent>) {
    this._contract = contract;
    this._watchEvents = watchEvents;
    this.setWeb3();
    this.fetchContractInstance();
    this.setTimer();
  }

  private setWeb3() {
    const Web3 = require('web3');
    web3 = new Web3(ContractUtil.getProvider());
  }

  private setTimer() {
    setInterval(this.getPastEvents.bind(this), ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
  }

  protected async fetchContractInstance() {
    const abi = this.getAbiFromArtifact();
    const contractAddress = this.getContractAddressFromArtifact();

    try {
      this._contractInstance = new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
      console.error(error);
    }
    this.getPastEvents();
  }

  private getAbiFromArtifact() {
    return this._contract['abi'];
  }

  private getContractAddressFromArtifact() {
    const ROPSTEN_NETWORK_ID = 3;
    return this._contract['networks'][ROPSTEN_NETWORK_ID]['address'];
  }

  protected async getPastEvents(): Promise<void> {
    const latestBlock: Block = await this.getBlock('latest');
    const isAlreadyReaded: boolean = latestBlock.number <= this._lastReadedBlockNumber;

    console.log('blockCheck... ', ++blockChcekFlag);

    if (isAlreadyReaded) return;

    blockChcekFlag = 0;

    this._latestBlockNumber = latestBlock.number;
    console.log('====================================');
    console.log('event Range: ', this.getEventRange());
    console.log('new Block!:', this._latestBlockNumber);

    this._watchEvents.forEach(eventType => {
      this._contractInstance.getPastEvents(
        RayonEvent.getRayonEventName(eventType),
        this.getEventRange(),
        this.handlePastEventFetched.bind(this, eventType)
      );
    });
    this._lastReadedBlockNumber = latestBlock.number;
  }

  protected handlePastEventFetched(eventType, error, events) {
    events.forEach(event => this.onEvent(eventType, error, event));
  }

  public setEventListner(listner: RayonEventListener) {
    this._eventListener = listner;
  }

  private onEvent(eventType: number, error, event): void {
    console.log('new event:', event['event']);
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

  public async getBlock(blockNumber: any): Promise<Block> {
    return await web3.eth.getBlock(blockNumber);
  }

  public getEventRange() {
    return { fromBlock: this._lastReadedBlockNumber + 1, toBlock: this._latestBlockNumber };
  }

  public getTokenTotalBalance(): number {
    return this._totalTokenSupply;
  }

  public getTokenCap(): number {
    return this._tokenCap;
  }

  public async setTokenTotalBalance(): Promise<void> {
    this._totalTokenSupply = parseInt(await this._contractInstance.methods.totalSupply().call(), 10);
  }

  public async setTokenCap(): Promise<void> {
    this._tokenCap = parseInt(await this._contractInstance.methods.cap().call(), 10) / 1000000000000000000;
  }
}

export default RayonContractAgent;
