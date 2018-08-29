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

class TokenBlockchainAgent extends ContractAgent {
  constructor() {
    const contract = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../../../webapp/build/contracts/RayonToken.json'), 'utf8')
    );
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.Mint, RayonEvent.Transfer]);
    super(contract, watchEvents);
  }

  public async getTokenTotalBalance() {
    return (await this._contractInstance.totalSupply()).toNumber();
  }
}

export default new TokenBlockchainAgent();
