import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';

// Token URL
export const URLForGetTokenTotalBalance = `${parentUrl}/GetTotalBalance`;
export const URLForGetTokenHolders = `${parentUrl}/GetTokenHolders`;
export const URLForGetTop10TokenHolders = `${parentUrl}/GetTop10TokenHolders`;

// Event URL
export const URLForGetMintEvents = `${parentUrl}/MintEvents`;
export const URLForGetTransferEvents = `${parentUrl}/TransferEvents`;
export const URLForGetTransactionChartData = `${parentUrl}/GetTransactionChartData`;

/*
event
*/
export enum RayonEvent {
  Mint = 1,
  Transfer,
}

export interface RayonEventResponce<T> {
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  type: string;
  event: string;
  args: T;
}

/*
Event Respond and Event Arguments interface
*/
export interface MintArgs {
  to: string;
  amount: BigNumber;
}

export interface MintEvent {
  to: string;
  amount: number;
}

export interface TransferArgs {
  from: string;
  to: string;
  value: BigNumber;
}

export interface TransferEvent {
  txHash: string;
  blockNumber: number;
  blockTime: BlockTime;
  from: string;
  to: string;
  amount: number;
}

/*
Etc
*/
export interface ChartData {
  labels: string[];
  chartData: number[];
}

export interface BlockTime {
  timestamp: number;
  year: number;
  month: number;
  date: number;
}
