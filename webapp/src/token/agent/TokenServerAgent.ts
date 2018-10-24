// agent
import RayonServerAgent from 'common/agent/RayonServerAgent';

// model
import {
  URLForGetTokenHistory,
  URLForGetTokenHolders,
  URLForGetTokenTotalSupply,
  URLForGetTokenCap,
  Holder,
  TokenHistory,
} from '../../../../shared/token/model/Token';

class TokenServerAgent extends RayonServerAgent {
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
