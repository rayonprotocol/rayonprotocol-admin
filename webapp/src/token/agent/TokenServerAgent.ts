// agent
import ContractAgent from 'common/agent/ContractAgent';

// model
import {
  URLForGetTokenHistory,
  URLForGetTokenHolders,
  URLForGetMintEvents,
  URLForGetTransferEvents,
  URLForGetDashboardTokenHolders,
  MintEvent,
  TransferEvent,
  UserTokenHistory,
} from '../../../../shared/token/model/Token';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// util
import ContractUtil from 'common/util/ContractUtil';

class TokenServerAgent extends ContractAgent {
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
    return parseInt(await this._contractInstance.methods.totalSupply().call(), 10);
  }

  async fetchTokenHolders(): Promise<object> {
    return await this.getRequest<object>(URLForGetTokenHolders);
  }

  async fetchTokenHistory(): Promise<UserTokenHistory> {
    return await this.getRequest<UserTokenHistory>(URLForGetTokenHistory);
  }
}

export default new TokenServerAgent();
