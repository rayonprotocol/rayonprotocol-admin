import * as fs from 'fs';
import * as path from 'path';
import { BigNumber } from 'bignumber.js';

import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class ContractUtil {
  public getContract(contractAddress: string) {
    const contractPath = `../../../../shared/build/${process.env.ENV_BLOCKCHAIN}/${contractAddress}.json`;
    return JSON.parse(fs.readFileSync(path.join(__dirname, contractPath), 'utf8'));
  }

  public getHttpProvider() {
    const Web3 = require('web3');
    const url: Object = ContractConfigure.getHttpUrl(process.env.ENV_BLOCKCHAIN);
    return new Web3.providers.HttpProvider(url);
  }

  public weiToToken(wei) {
    return new BigNumber(wei).dividedBy(new BigNumber(10).pow(18));
  }
}
export default new ContractUtil();
