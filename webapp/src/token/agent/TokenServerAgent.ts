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
  TokenHistory,
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

  async fetchTokenHistory(userAddr: string): Promise<TokenHistory[]> {
    return await this.getRequest<TokenHistory[]>(URLForGetTokenHistory, {
      userAddr,
    });
  }

  async fetchTokenTotalBalance(): Promise<number> {
    return await this.getRequest<number>(URLForGetTokenTotalSupply);
  }

  async fetchTokenCap(): Promise<number> {
    return await this.getRequest<number>(URLForGetTokenCap);
  }
}

export default new TokenServerAgent();
