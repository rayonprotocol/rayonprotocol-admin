// agent
import ContractAgent from 'common/agent/ContractAgent';

// model
import {
  URLForGetTokenHistory,
  URLForGetTokenHolders,
  URLForGetTop10TokenHolders,
  URLForGetMintEvents,
  URLForGetTransferEvents,
  MintEvent,
  TransferEvent,
  RayonEvent,
  UserTokenHistory,
} from '../../../../shared/token/model/Token';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// util
import ContractUtil from 'common/util/ContractUtil';

class TokenServerAgent extends ContractAgent {
  constructor() {
    const contract = ContractUtil.getContractArtifact(ContractConfigure.ADDR_RAYONTOKEN);
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.Mint, RayonEvent.Transfer]);
    super(contract, watchEvents);
  }

  /*
  Communicate to node-server
  Fetch Kind of rayon token event
  */
  async fetchMintEvents(): Promise<MintEvent[]> {
    return await this.getRequest<MintEvent[]>(URLForGetMintEvents);
  }

  async fetchTransferEvents(): Promise<TransferEvent[]> {
    return await this.getRequest<TransferEvent[]>(URLForGetTransferEvents);
  }

  // 토큰의 총 발행량
  async fetchTokenTotalBalance(): Promise<number> {
    return parseInt(await this._contractInstance.methods.totalSupply().call(), 10);
  }

  // 토큰 보유자들의 리스트
  async fetchTokenHolders(): Promise<object> {
    return await this.getRequest<object>(URLForGetTokenHolders);
  }

  // 상위 10명의 토큰 보유자
  async fetchTop10TokenHolders(): Promise<object> {
    return await this.getRequest<object>(URLForGetTop10TokenHolders);
  }

  // 유저 별 토큰 전송 히스토리
  async fetchTokenHistory(): Promise<UserTokenHistory> {
    return await this.getRequest<UserTokenHistory>(URLForGetTokenHistory);
  }
}

export default new TokenServerAgent();
