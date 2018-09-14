import { BigNumber } from 'bignumber.js';

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

  async fetchTokenHolders(): Promise<object> {
    return await this.getRequest<object>(URLForGetTokenHolders);
  }

  async fetchTokenHistory(): Promise<UserTokenHistory> {
    const userTokenHistories = await this.getRequest<UserTokenHistory>(URLForGetTokenHistory);
    for (const tokenHitories of Object.keys(userTokenHistories)) {
      userTokenHistories[tokenHitories].forEach(history =>
        Object.assign(history, {
          amount: new BigNumber(history.amount),
          balance: new BigNumber(history.balance),
        })
      );
    }
    return userTokenHistories;
  }

  async fetchTokenTotalBalance(): Promise<BigNumber> {
    return new BigNumber(await this.getRequest<string>(URLForGetTokenTotalSupply));
  }

  async fetchTokenCap(): Promise<BigNumber> {
    return new BigNumber(await this.getRequest<string>(URLForGetTokenCap));
  }
}

export default new TokenServerAgent();
