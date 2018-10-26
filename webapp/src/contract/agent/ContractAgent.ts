// agent
import RayonServerAgent from 'common/agent/RayonServerAgent';

// model
import Contract, {
  ABI_TYPE_EVENT,
  ABI_TYPE_FUNCTION,
  URLForGetContractLogs,
  URLForGetAllContracts,
} from '../../../../shared/contract/model/Contract';
import { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

class ContractAgent extends RayonServerAgent {
  public async fetchEventLogs(address: string) {
    const params = { type: ABI_TYPE_EVENT, address };
    return await this.getRequest<EventLog[]>(URLForGetContractLogs, params);
  }

  public async fetchFunctionLogs(address: string) {
    const params = { type: ABI_TYPE_FUNCTION, address };
    return await this.getRequest<FunctionLog[]>(URLForGetContractLogs, params);
  }

  public async fetchAllContract() {
    return await this.getRequest<Promise<Contract[]>>(URLForGetAllContracts);
  }
}

export default new ContractAgent();
