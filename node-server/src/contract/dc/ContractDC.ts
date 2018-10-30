import { Express, Request, Response } from 'express';

// agent
import ContractDbAgent from '../agent/ContractDbAgent';
import RegistryAgent from '../../registry/agent/RegistryAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';
import sendResult from '../../main/dc/sendResult';

// model
import Contract, {
  URLForGetAllLogs,
  URLForGetContractLogs,
  URLForGetAllContracts,
  URLForGetAllOwner,
  ABI_TYPE_FUNCTION,
  ABI_TYPE_EVENT,
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
    res.status(200).sendResult(contracts);
  }

  public async respondAllContractOwner(req: Request, res: Response) {
    const ownerList = RegistryAgent.getContractOwnerAddrList();
    res.status(200).sendResult(ownerList);
  }

  public async respondAllContractLogs(req: Request, res: Response) {
    const type = req.query.type;
    if (!type) return res.status(400).sendResult<void>(this.RESULT_CODE_FAIL, 'Log type missing', null);

    const validRayonLogtype = type === ABI_TYPE_FUNCTION || type === ABI_TYPE_EVENT;
    if (!validRayonLogtype)
      return res.status(400).sendResult<void>(this.RESULT_CODE_FAIL, `${type} is not rayon log type`, null);

    const constractLogs = await ContractDbAgent.getAllContractLogs(type);
    res.status(200).sendResult(constractLogs);
  }

  public async respondContractLogs(req: Request, res: Response) {
    const contractAddr = req.query.address;
    if (!contractAddr) return res.status(400).sendResult<void>(this.RESULT_CODE_FAIL, 'Contract address missing', null);

    const validRayonContractAddr = RegistryAgent.getContractAddrList().indexOf(contractAddr) > -1;
    if (!validRayonContractAddr)
      return res
        .status(400)
        .sendResult<void>(this.RESULT_CODE_FAIL, `${contractAddr} is not rayon contract address`, null);

    const type = req.query.type;
    if (!type) return res.status(400).sendResult<void>(this.RESULT_CODE_FAIL, 'Log type missing', null);

    const validRayonLogtype = type === ABI_TYPE_FUNCTION || type === ABI_TYPE_EVENT;
    if (!validRayonLogtype)
      return res.status(400).sendResult<void>(this.RESULT_CODE_FAIL, `${type} is not rayon log type`, null);

    const contractLogs = await ContractDbAgent.getContractLogs(contractAddr, type);
    res.status(200).sendResult<any>(contractLogs);
  }
}

export default new ContractDC();
