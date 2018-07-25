export interface Mint {
  to: string;
  amount: number;
}

export interface TransferEvent {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  amount: number;
}

export interface Holder {
  address: string;
  quantity: number;
  percentage: number;
}
