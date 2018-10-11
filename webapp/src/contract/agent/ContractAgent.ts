// agent
import RayonContractAgent from 'common/agent/RayonContractAgent';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { URLForGetEventLogs, URLForGetMethodLogs } from '../../../../shared/contract/model/Contract';
import { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

// util
import ContractUtil from 'common/util/ContractUtil';

class ContractAgent extends RayonContractAgent {
  constructor() {
    const contract = ContractUtil.getContractArtifact(ContractConfigure.ADDR_RAYONTOKEN);
    super(contract);
  }

  public async fetchEventLogs() {
    return await this.getRequest<FunctionLog[]>(URLForGetEventLogs);
  }

  public async fetchMethodLogs() {
    return await this.getRequest<EventLog[]>(URLForGetMethodLogs);
  }
}

export default new ContractAgent();
