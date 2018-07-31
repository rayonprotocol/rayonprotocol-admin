import { BigNumber } from 'bignumber.js';

import { relativeUrl as parentUrl } from '../../interface/Ajax';
export const URLForGetMintEvents = `${parentUrl}/MintEvents`;
export const URLForGetTransferEvents = `${parentUrl}/TransferEvents`;
export const URLForGetTransactionChartData = `${parentUrl}/GetTransactionChartData`;

export const EventTransfer = 'Transfer';
export const EventMint = 'Mint';

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

export enum RayonEvent {
  Mint = 1,
  Transfer,
}

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

export interface BlockTime {
  timestamp: number;
  year: number;
  month: number;
  date: number;
}

export interface ChartData {
  labels: string[];
  chartData: number[];
}

export default RayonEventResponce;
