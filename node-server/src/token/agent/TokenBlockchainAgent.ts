import RayonBlockchainAgent from '../../common/agent/RayonBlockchainAgent';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';

class TokenBlockchainAgent extends RayonBlockchainAgent {
  constructor() {
    const watchEvents: Set<RayonEvent> = new Set([RayonEvent.Mint, RayonEvent.Transfer]);
    super(ContractConfigure.ADDR_RAYONTOKEN, watchEvents);
  }
}

export default new TokenBlockchainAgent();
