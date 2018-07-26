import { Express, Request, Response } from 'express';

// model
import RayonEvent from '../../../../shared/event/model/RayonEvent';
import SendResult from '../../../../shared/common/model/SendResult';
import {
  URLForGetTokenTotalBalance,
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
} from '../../../../shared/token/model/Token';

// dc
import ContractDC from '../../common/dc/ContractDC';

class TokenDC {
  private _tokenHolders = {};

  public configure(app: Express) {
    app.get(URLForGetTokenTotalBalance, this.respondTokenTotalBalance.bind(this));
    app.get(URLForGetTokenHolders, this.respondTokenHolders.bind(this));
    app.get(URLForGetTop10TokenHolders, this.respondTop10TokenHolders.bind(this));
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

  public async respondTop10TokenHolders(req: Request, res: Response) {
    const top10TokenHolders = {};
    let top10Sum = 0;

    let sortedTokenHolders = Object.keys(this._tokenHolders).sort(
      (a, b) => this._tokenHolders[b] - this._tokenHolders[a]
    );

    sortedTokenHolders = sortedTokenHolders.length > 10 ? sortedTokenHolders.slice(10) : sortedTokenHolders;
    sortedTokenHolders.forEach(item => {
      top10Sum += this._tokenHolders[item];
      top10TokenHolders[item] = this._tokenHolders[item];
    });

    top10TokenHolders['etc'] = sortedTokenHolders.length > 10 ? (await this.getTokenBalance()) - top10Sum : 0;

    if (res.status(200)) {
      const result: SendResult<object> = {
        result_code: 0,
        result_message: 'Success Respond Token Total Balance',
        data: top10TokenHolders,
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
