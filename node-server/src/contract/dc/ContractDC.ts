import { Express, Request, Response } from 'express';

// agent
import ContractDbAgent from '../agent/ContractDbAgent';
import RayonArtifactAgent from '../../log/agent/RayonArtifactAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import {
  URLForGetAllLogs,
  URLForGetContractLogs,
  URLForGetContractOverview,
} from '../../../../shared/contract/model/Contract';

class ContractDC extends RayonDC {
  public configure(app: Express) {
    app.get(URLForGetAllLogs, this.respondAllContractLogs.bind(this));
    app.get(URLForGetContractLogs, this.respondContractLogs.bind(this));
    app.get(URLForGetContractOverview, this.respondContractOverview.bind(this));
  }

  public async respondContractOverview(req: Request, res: Response) {
    const contractOverview = RayonArtifactAgent.getContractOverview(req.query.address);
    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Contract Overview', contractOverview)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Contract Overview', null);

    res.send(result);
  }

  public async respondAllContractLogs(req: Request, res: Response) {
    const type = req.query.type;
    const methodLogs = await ContractDbAgent.getAllContractLogs(type);
    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond All Contract Logs', methodLogs)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond All Contract Logs', null);
    res.send(result);
  }

  public async respondContractLogs(req: Request, res: Response) {
    const contractAddress = req.query.address;
    const type = req.query.type;
    const contractLogs = await ContractDbAgent.getContractLogs(contractAddress, type);
    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Contract Logs', contractLogs)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Contract Logs', null);

    res.send(result);
  }
}

export default new ContractDC();
