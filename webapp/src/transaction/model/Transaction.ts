interface Transaction {
  txHash: string;
  block: number;
  timestamp: number;
  from: string;
  to: string;
  value: number;
}

export default Transaction;
