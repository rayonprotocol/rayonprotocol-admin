interface Transaction {
  txHash: string;
  block: number;
  timestamp: number;
  from: string;
  to: string;
  value: number;
}

export interface Holder {
  address: string;
  quantity: number;
  percentage: number;
}

export default Transaction;
