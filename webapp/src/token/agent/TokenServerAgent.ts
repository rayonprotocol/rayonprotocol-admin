// agent
import ServerAgent from 'common/agent/ServerAgent';

// model
import {
  URLForGetTokenTotalBalance,
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
} from '../../../../shared/token/model/Token';

class TokenServerAgent extends ServerAgent {
  async fetchTokenTotalBalance() {
    return await ServerAgent.getRequest<number>(URLForGetTokenTotalBalance);
  }

  async fetchTokenHolders() {
    return await ServerAgent.getRequest<object>(URLForGetTokenHolders);
  }

  async fetchTop10TokenHolders() {
    return await ServerAgent.getRequest<object>(URLForGetTop10TokenHolders);
  }
}

export default new TokenServerAgent();
