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

/*
Etc
*/
export type UserTokenHistory = {
  [userAddress: string]: TokenHistory[];
};

export interface TokenHistory {
  from: string;
  to: string;
  amount: BigNumber;
  balance?: BigNumber;
  blockTime: BlockTime;
}

export interface BlockTime {
  timestamp: number;
  year: number;
  month: number;
  date: number;
}
