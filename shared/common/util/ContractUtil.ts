import { BigNumber } from 'bignumber.js';

class ContractUtil {
  public static weiToToken = wei => {
    return new BigNumber(wei).dividedBy(new BigNumber(10).pow(18));
  };
}

export default ContractUtil;
