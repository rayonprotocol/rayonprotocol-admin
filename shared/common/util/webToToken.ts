import { BigNumber } from 'bignumber.js';

export const weiToToken = wei => {
  return new BigNumber(wei).dividedBy(new BigNumber(10).pow(18));
};
