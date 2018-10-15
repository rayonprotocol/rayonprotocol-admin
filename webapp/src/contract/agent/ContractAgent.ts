// agent
import RayonContractAgent from 'common/agent/RayonContractAgent';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { URLForGetEventLogs, URLForGetFunctionLogs } from '../../../../shared/contract/model/Contract';
import { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

// util
import ContractUtil from 'common/util/ContractUtil';

class ContractAgent extends RayonContractAgent {
  constructor() {
    const contract = ContractUtil.getContractArtifact(ContractConfigure.ADDR_RAYONTOKEN);
    super(contract);
  }

  public async fetchEventLogs() {
    return await this.getRequest<EventLog[]>(URLForGetEventLogs);
  }

  public async fetchFunctionLogs() {
    const functionLogs = await this.getRequest<FunctionLog[]>(URLForGetFunctionLogs);
    const newFunctionLogs: FunctionLog[] = [];
    functionLogs.forEach(functionLog => {
      const newFunctionLog: FunctionLog = {
        blockNumber: functionLog.blockNumber,
        txHash: functionLog.txHash,
        status: functionLog.status,
        contractAddress: functionLog.contractAddress,
        functionName: functionLog.functionName,
        inputData: functionLog.inputData,
        calledTime: functionLog.calledTime,
        urlEtherscan: functionLog.urlEtherscan,
      };
      newFunctionLogs.push(newFunctionLog);
    });
    return newFunctionLogs;
  }
}

export default new ContractAgent();
