// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// model
import { TokenHistory, Holder } from '../../../../shared/token/model/Token';

class TokenDC {
  public async fetchTokenTotalSupply(): Promise<number> {
    return await TokenServerAgent.fetchTokenTotalSupply();
  }
  public async fetchTokenCap(): Promise<number> {
    return await TokenServerAgent.fetchTokenCap();
  }
  public async fetchTokenHolders(): Promise<Holder[]> {
    return await TokenServerAgent.fetchTokenHolders();
  }
  async fetchTokenHistory(userAddr:string): Promise<TokenHistory[]> {
    return await TokenServerAgent.fetchTokenHistory(userAddr);
  }
}

export default new TokenDC();
