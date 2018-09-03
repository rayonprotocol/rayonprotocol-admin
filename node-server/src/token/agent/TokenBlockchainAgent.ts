import { Express, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// agent
import ContractAgent from '../../common/agent/ContractAgent';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import {
  URLForGetTokenTotalBalance,
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
  RayonEvent,
} from '../../../../shared/token/model/Token';

// util
import ContractUtil from '../../common/util/ContractUtil';

class TokenBlockchainAgent extends ContractAgent {
  constructor() {
    const contract = ContractUtil.getContract(ContractConfigure.ADDR_RAYONTOKEN);
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.Mint, RayonEvent.Transfer]);
    super(contract, watchEvents);
  }

  public async getTokenTotalBalance() {
    return await this._contractInstance.totalSupply;
  }
}

export default new TokenBlockchainAgent();
