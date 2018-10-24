import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';

// Token URL
export const URLForGetTokenHolders = `${parentUrl}/tokenholders`;
export const URLForGetTokenHistory = `${parentUrl}/tokenhistory`;
export const URLForGetTokenTotalSupply = `${parentUrl}/totaltokensupply`;
export const URLForGetTokenCap = `${parentUrl}/tokencap`;

export interface Holder {
  address: string;
  balance: string;
}

export interface TokenHistory {
  from: string;
  to: string;
  amount: number;
  calledTime: number;
}
