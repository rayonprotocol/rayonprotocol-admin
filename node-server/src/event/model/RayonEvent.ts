import { BigNumber } from 'bignumber.js';

interface RayonEvent<T> {
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

export default RayonEvent;
