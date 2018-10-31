import { promisify } from 'util';
import { BigNumber } from 'bignumber.js';
import { Express, Request, Response } from 'express';

// agent
import TokenDbAgent from '../agent/TokenDbAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';
import sendResult from '../../main/dc/sendResult';

// model
import {
  URLForGetTokenHolders,
  URLForGetTokenHistory,
  URLForGetTokenTotalSupply,
  URLForGetTokenCap,
  Holder,
  TokenHistory,
} from '../../../../shared/token/model/Token';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import TokenBlockchainAgent from '../agent/TokenBlockchainAgent';

class TokenDC extends RayonDC {
  public configure(app: Express) {
    app.get(URLForGetTokenHolders, this.respondTokenHolders.bind(this));
    app.get(URLForGetTokenHistory, this.respondTokenHistory.bind(this));
    app.get(URLForGetTokenTotalSupply, this.respondTotalSupply.bind(this));
    app.get(URLForGetTokenCap, this.respondTokenCap.bind(this));
  }

  public async respondTokenHolders(req: Request, res: Response) {
    const tokenHolders = await TokenDbAgent.getTokenHolders();
    res.status(200).sendResult(tokenHolders);
  }

  public async respondTokenHistory(req: Request, res: Response) {
    const userAddr = req.query.userAddr;
    if (!userAddr) return res.status(400).sendResult(this.RESULT_CODE_FAIL, 'User address missing');

    const tokenHistory = await TokenDbAgent.getTokenHistory(userAddr);

    res.status(200).sendResult(tokenHistory);
  }

  public async respondTokenCap(req: Request, res: Response) {
    const tokenCap = await TokenBlockchainAgent.getTokenCap();
    res.status(200).sendResult(Math.round(tokenCap.toNumber()));
  }

  public async respondTotalSupply(req: Request, res: Response) {
    const totalSupply = await TokenBlockchainAgent.getTotalSupply();
    res.status(200).sendResult(Math.round(totalSupply.toNumber()));
  }
}

export default new TokenDC();
