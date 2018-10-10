import { Express, Request, Response } from 'express';

// agent
import ContractDbAgent from '../agent/ContractDbAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import { URLForGetMethodLogs } from '../../../../shared/contract/model/Contract';

class ContractDC extends RayonDC {
  public configure(app: Express) {
    app.get(URLForGetMethodLogs, this.respondMethodLogs.bind(this));
  }

  public async respondMethodLogs(req: Request, res: Response) {
    const methodLogs = await ContractDbAgent.getMethodLogs();

    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Method Logs', methodLogs)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Method Logs', null);

    res.send(result);
  }
}

export default new ContractDC();
