import { BigNumber } from 'bignumber.js';

// agent
import RayonContractAgent from 'common/agent/RayonContractAgent';

// model
import {
  URLForGetTokenHistory,
  URLForGetTokenHolders,
  URLForGetTokenTotalSupply,
  URLForGetTokenCap,
  Holder,
  UserTokenHistory,
} from '../../../../shared/token/model/Token';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// util
import ContractUtil from 'common/util/ContractUtil';

class TokenServerAgent extends RayonContractAgent {
  constructor() {
    const contract = ContractUtil.getContractArtifact(ContractConfigure.ADDR_RAYONTOKEN);
    super(contract);
  }

  async fetchTokenHolders(): Promise<Holder[]> {
    return await this.getRequest<Holder[]>(URLForGetTokenHolders);
  }

  async fetchTokenHistory(): Promise<UserTokenHistory> {
    const userTokenHistories = await this.getRequest<UserTokenHistory>(URLForGetTokenHistory);
    for (const tokenHitories of Object.keys(userTokenHistories)) {
      userTokenHistories[tokenHitories].forEach(history =>
        Object.assign(history, {
          amount: new BigNumber(history.amount),
          balance: new BigNumber(history.balance),
        })
      );
    }
    return userTokenHistories;
  }

  async fetchTokenTotalBalance(): Promise<BigNumber> {
    return new BigNumber(await this.getRequest<string>(URLForGetTokenTotalSupply));
  }

  async fetchTokenCap(): Promise<BigNumber> {
    return new BigNumber(await this.getRequest<string>(URLForGetTokenCap));
  }
}

export default new TokenServerAgent();
