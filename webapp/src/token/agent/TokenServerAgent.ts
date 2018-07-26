// agent
import ServerAgent from 'common/agent/ServerAgent';

// model
import { URLForGetTokenTotalBalance } from '../../../../shared/token/model/Token';

class TokenServerAgent extends ServerAgent {
  async fetchTokenTotalBalance() {
    return await ServerAgent.getRequest<number>(URLForGetTokenTotalBalance);
  }
}

export default new TokenServerAgent();
