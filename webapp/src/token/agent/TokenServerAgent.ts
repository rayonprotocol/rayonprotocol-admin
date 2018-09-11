// agent
import RayonContractAgent from 'common/agent/RayonContractAgent';

// model
import {
  URLForGetTokenHistory,
  URLForGetTokenHolders,
  URLForGetMintEvents,
  URLForGetTransferEvents,
  URLForGetDashboardTokenHolders,
  URLForGetTokenTotalSupply,
  URLForGetTokenCap,
  MintEvent,
  TransferEvent,
  UserTokenHistory,
} from '../../../../shared/token/model/Token';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// util
import ContractUtil from 'common/util/ContractUtil';

class TokenServerAgent extends RayonContractAgent {
  constructor() {
    const contract = ContractUtil.getContractArtifact(ContractConfigure.ADDR_RAYONTOKEN);
    super(contract);
  }

  async fetchMintEvents(): Promise<MintEvent[]> {
    return await this.getRequest<MintEvent[]>(URLForGetMintEvents);
  }

  async fetchTransferEvents(): Promise<TransferEvent[]> {
    return await this.getRequest<TransferEvent[]>(URLForGetTransferEvents);
  }

  async fetchDashboardTokenHolders(): Promise<object> {
    return await this.getRequest<object>(URLForGetDashboardTokenHolders);
  }

  async fetchTokenTotalBalance(): Promise<number> {
    return await this.getRequest<number>(URLForGetTokenTotalSupply);
  }

  async fetchTokenHolders(): Promise<object> {
    return await this.getRequest<object>(URLForGetTokenHolders);
  }

  async fetchTokenHistory(): Promise<UserTokenHistory> {
    return await this.getRequest<UserTokenHistory>(URLForGetTokenHistory);
  }

  async fetchTokenCap(): Promise<number> {
    return await this.getRequest<number>(URLForGetTokenCap);
  }
}

export default new TokenServerAgent();
