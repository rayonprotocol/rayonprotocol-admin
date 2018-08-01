import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// dc
import TokenDC from '../../token/dc/TokenDC';

let web3: Web3;

abstract class ContractAgent {
  public static FROM_BLOCK = 0;
  protected _eventListeners = {};
  protected _contractInstance;

  constructor() {
    const Web3 = require('web3');
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(provider);
    this.fetchContractInstance();
  }

  protected abstract async fetchContractInstance();

  protected abstract startEventWatch();

  public getWeb3() {
    return web3;
  }

  public getContractInstance() {
    return this._contractInstance;
  }

  public async getBlock(blockNumber: number) {
    return await web3.eth.getBlock(blockNumber);
  }
}

export default ContractAgent;
