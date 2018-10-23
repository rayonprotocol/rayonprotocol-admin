// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// model
import { UserTokenHistory, Holder } from '../../../../shared/token/model/Token';

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
  async fetchTokenHistory(): Promise<UserTokenHistory> {
    return await TokenServerAgent.fetchTokenHistory();
  }
}

export default new TokenDC();
