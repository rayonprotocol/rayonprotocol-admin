import { Express, Request, Response } from 'express';

// model
import RayonEvent from '../../../../shared/event/model/RayonEvent';
import SendResult from '../../../../shared/common/model/SendResult';
import { URLForGetTokenTotalBalance } from '../../../../shared/token/model/Token';

// dc
import ContractDC from '../../common/dc/ContractDC';

class TokenDC {
  private _tokenHolders = {};

  public configure(app: Express) {
    app.get(URLForGetTokenTotalBalance, this.respondTokenTotalBalance.bind(this));
  }

  /*
    about token balance
  */
  public async getTokenBalance() {
    return (await ContractDC.getTokenContractInstance().totalSupply()).toNumber();
  }

  public async respondTokenTotalBalance(req: Request, res: Response) {
    const _tokenBalence = (await ContractDC.getTokenContractInstance().totalSupply()).toNumber();
    if (res.status(200)) {
      const result: SendResult<number> = {
        result_code: 0,
        result_message: 'Success Respond Token Total Balance',
        data: _tokenBalence,
      };
      res.send(result);
    } else {
      const result: SendResult<number> = {
        result_code: 1,
        result_message: 'Fail Respond Token Total Balance',
        data: null,
      };
      res.send(result);
    }
  }

  /*
    about token holders
  */
  public getHolders() {
    return this._tokenHolders;
  }

  public setHolders(from: string, to: string, amount: number) {
    this._tokenHolders[from] = this._tokenHolders[from] === undefined ? -amount : this._tokenHolders[from] - amount;
    this._tokenHolders[to] = this._tokenHolders[to] === undefined ? amount : this._tokenHolders[to] + amount;
  }

  public async respondTokenHolders(req: Request, res: Response) {
    if (res.status(200)) {
      const result: SendResult<object> = {
        result_code: 0,
        result_message: 'Success Respond Token Total Balance',
        data: this._tokenHolders,
      };
      res.send(result);
    } else {
      const result: SendResult<object> = {
        result_code: 1,
        result_message: 'Fail Respond Token Total Balance',
        data: null,
      };
      res.send(result);
    }
  }
}

export default new TokenDC();
