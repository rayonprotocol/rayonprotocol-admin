import { promisify } from 'util';
import { BigNumber } from 'bignumber.js';
import { Express, Request, Response } from 'express';

// agent
import TokenDbAgent from '../agent/TokenDbAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import SendResult from '../../../../shared/common/model/SendResult';
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
import { weiToToken } from '../../../../shared/common/util/webToToken';
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
    const result: SendResult<Holder[]> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token Holders', tokenHolders)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token Holders', null);

    res.send(result);
  }

  public async respondTokenHistory(req: Request, res: Response) {
    const userAddr = req.query.userAddr;
    const tokenHistory = await TokenDbAgent.getTokenHistory(userAddr);
    const result: SendResult<TokenHistory[]> = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Token History', tokenHistory)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token History', null);

    res.send(result);
  }

  public async respondTokenCap(req: Request, res: Response) {
    const tokenCap = await TokenBlockchainAgent.getTokenCap();
    const result: SendResult<number> = res.status(200)
      ? this.generateResultResponse(
          this.RESULT_CODE_SUCCESS,
          'Success Respond Token cap',
          Math.round(tokenCap.toNumber())
        )
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Token cap', null);

    res.send(result);
  }

  public async respondTotalSupply(req: Request, res: Response) {
    const totalSupply = await TokenBlockchainAgent.getTotalSupply();
    const result: SendResult<number> = res.status(200)
      ? this.generateResultResponse(
          this.RESULT_CODE_SUCCESS,
          'Success Respond Total Supply',
          Math.round(totalSupply.toNumber())
        )
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Total Supply', null);

    res.send(result);
  }
}

export default new TokenDC();
