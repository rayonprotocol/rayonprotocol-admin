import { Express, Request, Response } from 'express';

// agent
import ContractDbAgent from '../agent/ContractDbAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';
import sendResult from '../../main/dc/sendResult';

// model
import Contract, {
  URLForGetContractLogs,
  URLForGetAllContracts,
  ABI_TYPE_FUNCTION,
  ABI_TYPE_EVENT,
} from '../../../../shared/contract/model/Contract';

class ContractDC extends RayonDC {
  public configure(app: Express) {
    app.get(URLForGetContractLogs, this.respondContractLogs.bind(this));
  }

  public async respondContractLogs(req: Request, res: Response) {
    const contractAddr = req.query.address;
    if (!contractAddr) return res.status(400).sendResult<void>(this.RESULT_CODE_FAIL, 'Contract address missing', null);

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
