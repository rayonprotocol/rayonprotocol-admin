// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// model
import { TokenHistory, Holder } from '../../../../shared/token/model/Token';

class TokenDC {
  public async fetchTokenTotalBalance(): Promise<number> {
    return await TokenServerAgent.fetchTokenTotalBalance();
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
