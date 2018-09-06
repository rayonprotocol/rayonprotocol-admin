// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// model
import { TransferEvent, UserTokenHistory } from '../../../../shared/token/model/Token';

class TokenDC {
  public async fetchTransferEvents(): Promise<TransferEvent[]> {
    return await TokenServerAgent.fetchTransferEvents();
  }
  // 토큰의 총 발행량
  public async fetchTokenTotalBalance(): Promise<number> {
    return await TokenServerAgent.fetchTokenTotalBalance();
  }
  // 토큰 보유자들의 리스트
  public async fetchTokenHolders(): Promise<object> {
    return await TokenServerAgent.fetchTokenHolders();
  }
  // 유저 별 토큰 전송 히스토리
  async fetchTokenHistory(): Promise<UserTokenHistory> {
    return await TokenServerAgent.fetchTokenHistory();
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
