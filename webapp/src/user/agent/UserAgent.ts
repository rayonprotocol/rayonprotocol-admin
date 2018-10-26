import { URLForGetAllOwner } from '../../../../shared/contract/model/Contract';

import RayonServerAgent from 'common/agent/RayonServerAgent';

class UserAgent extends RayonServerAgent {
  public async fetchAllOwner() {
    return await this.getRequest<Promise<string[]>>(URLForGetAllOwner);
  }
}

export default new UserAgent();
