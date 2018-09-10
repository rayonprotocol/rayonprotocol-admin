// agent
import RayonContractAgent from 'common/agent/RayonContractAgent';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// util
import ContractUtil from 'common/util/ContractUtil';

class ContractAgent extends RayonContractAgent {
  constructor() {
    const contract = ContractUtil.getContractArtifact(ContractConfigure.ADDR_RAYONTOKEN);
    super(contract);
  }
}

export default new ContractAgent();
