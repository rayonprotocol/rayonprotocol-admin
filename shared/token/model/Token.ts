import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';

// Token URL
export const URLForGetTokenHolders = `${parentUrl}/tokenholders`;
export const URLForGetTokenHistory = `${parentUrl}/tokenhistory`;
export const URLForGetTokenTotalSupply = `${parentUrl}/totaltokensupply`;
export const URLForGetTokenCap = `${parentUrl}/tokencap`;

// Event URL
export const URLForGetMintEvents = `${parentUrl}/mintEvents`;
export const URLForGetTransferEvents = `${parentUrl}/transferEvents`;

/*
event
*/
export enum RayonEvent {
  Mint = 1,
  Transfer,
}

const rayonEventNames = ['NONE', 'Mint', 'Transfer'];

export namespace RayonEvent {
  export function getRayonEventName(eventType: number) {
    return rayonEventNames[eventType];
  }
}

export interface RayonEventResponse<T> {
  blockHash: string;
  blockNumber: number;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  address: string;
  type: string;
  event: string;
  returnValues: T;
}

/*
Event Respond and Event Arguments interface
*/
export interface MintArgs {
  to: string;
  amount: number;
}

export interface MintEvent {
  to: string;
  amount: number;
}

export interface TransferArgs {
  from: string;
  to: string;
  value: string;
}

export interface TransferEvent {
  txHash: string;
  blockNumber: number;
  blockTime: BlockTime;
  from: string;
  to: string;
  amount: BigNumber;
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
  balance: BigNumber;
}

export interface BlockTime {
  timestamp: number;
  year: number;
  month: number;
  date: number;
}
