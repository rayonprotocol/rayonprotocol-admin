// agent
import RayonServerAgent from 'common/agent/RayonServerAgent';

// model
import Contract, { URLForGetContractLogs, URLForGetContractOverview } from '../../../../shared/contract/model/Contract';
import { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

class ContractAgent extends RayonServerAgent {
  public async fetchEventLogs(address: string) {
    const params = { type: Contract.ABI_TYPE_EVENT, address };
    return await this.getRequest<EventLog[]>(URLForGetContractLogs, params);
  }

  public async fetchFunctionLogs(address: string) {
    const params = { type: Contract.ABI_TYPE_FUNCTION, address };
    return await this.getRequest<FunctionLog[]>(URLForGetContractLogs, params);
  }

  public async fetchContractOverview(address: string) {
    const params = { address };
    return await this.getRequest(URLForGetContractOverview, params);
  }
}

export default new ContractAgent();
