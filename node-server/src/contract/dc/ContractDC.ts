import { Express, Request, Response } from 'express';

// agent
import ContractDbAgent from '../agent/ContractDbAgent';
import RegistryAgent from '../../registry/agent/RegistryAgent';
import RayonArtifactAgent from '../../log/agent/RayonArtifactAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import Contract, {
  URLForGetAllLogs,
  URLForGetContractLogs,
  URLForGetAllContracts,
  URLForGetAllOwner,
} from '../../../../shared/contract/model/Contract';

class ContractDC extends RayonDC {
  public configure(app: Express) {
    app.get(URLForGetAllLogs, this.respondAllContractLogs.bind(this));
    app.get(URLForGetContractLogs, this.respondContractLogs.bind(this));
    app.get(URLForGetAllContracts, this.respondAllContracts.bind(this));
    app.get(URLForGetAllOwner, this.respondAllContractOwner.bind(this));
  }

  public async respondAllContracts(req: Request, res: Response) {
    const contracts = RegistryAgent.getContracts();
    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Contract Overview', contracts)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Contract Overview', null);
    res.send(result);
  }

  public async respondAllContractOwner(req: Request, res: Response) {
    const ownerList = RegistryAgent.getContractOwnerAddrList();
    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Contract Overview', ownerList)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Contract Overview', null);
    res.send(result);
  }

  public async respondAllContractLogs(req: Request, res: Response) {
    const type = req.query.type;
    const constractLogs = await ContractDbAgent.getAllContractLogs(type);
    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond All Contract Logs', constractLogs)
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
