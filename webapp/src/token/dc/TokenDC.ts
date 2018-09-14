import { BigNumber } from 'bignumber.js';

// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// model
import { TransferEvent, UserTokenHistory } from '../../../../shared/token/model/Token';

class TokenDC {
  public async fetchTransferEvents(): Promise<TransferEvent[]> {
    return await TokenServerAgent.fetchTransferEvents();
  }
  public async fetchTokenTotalBalance(): Promise<BigNumber> {
    return await TokenServerAgent.fetchTokenTotalBalance();
  }
  public async fetchTokenCap(): Promise<BigNumber> {
    return await TokenServerAgent.fetchTokenCap();
  }
  public async fetchTokenHolders(): Promise<object> {
    return await TokenServerAgent.fetchTokenHolders();
  }
  async fetchTokenHistory(): Promise<UserTokenHistory> {
    return await TokenServerAgent.fetchTokenHistory();
  }
  public async fetchDashboardTokenHolders(): Promise<object> {
    return await TokenServerAgent.fetchDashboardTokenHolders();
  }
  // TODO: 아래의 메서드들은 TOKEN DC와 성격이 맞지 않으니 이관해야함
  public async getUserAccount(): Promise<string> {
    return await TokenServerAgent.getUserAccount();
  }

  public async getNetworkName(): Promise<string> {
    return await TokenServerAgent.getNetworkName();
  }
}

export default new TokenDC();
