import { Express, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// agent
import RayonContractAgent from '../../common/agent/RayonContractAgent';

// model
import SendResult from '../../../../shared/common/model/SendResult';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';

// util
import ContractUtil from '../../common/util/ContractUtil';

class TokenBlockchainAgent extends RayonContractAgent {
  constructor() {
    const contract = ContractUtil.getContract(ContractConfigure.ADDR_RAYONTOKEN);
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.Mint, RayonEvent.Transfer]);
    super(contract, watchEvents);
  }
}

export default new TokenBlockchainAgent();
