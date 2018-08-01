import { Express, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// agent
import ContractAgent from '../../common/agent/ContractAgent';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import {
  URLForGetTokenTotalBalance,
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
  RayonEvent,
} from '../../../../shared/token/model/Token';

class TokenAgent extends ContractAgent {
  /*
    about token balance
  */
  public async getTokenTotalBalance() {
    return (await this._contractInstance.totalSupply()).toNumber();
  }

  protected async fetchContractInstance() {
    const TruffleContract = require('truffle-contract');
    const artifaction = fs.readFileSync(
      path.join(__dirname, '../../../../webapp/build/contracts/RayonToken.json'),
      'utf8'
    );
    const contract = TruffleContract(JSON.parse(artifaction));
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
    const range = { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
    const mintEvent = this._contractInstance.Mint({}, range);
    const transferEvent = this._contractInstance.Transfer({}, range);

    mintEvent.watch(this.onEventOccur.bind(this, RayonEvent.Mint)); // mint 이벤트 watch 등록
    transferEvent.watch(this.onEventOccur.bind(this, RayonEvent.Transfer)); // mint 이벤트 watch 등록
  }

  /*
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */
  public setEventListner(eventType, listner: (event) => void) {
    this._eventListeners[eventType] = listner;
  }

  private onEventOccur(eventType: number, error, event) {
    // console.log(eventType, error, event);
    if (error) console.error(error);
    if (this._eventListeners[eventType] !== undefined) this._eventListeners[eventType](event);
  }
}

export default new TokenAgent();
