export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  nonce: string;
  sha3Uncles: string;
  logsBloom: string;
  transactionsRoot: string;
  stateRoot: string;
  miner: string;
  difficulty: string;
  totalDifficulty: string;
  size: number;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  timestamp: number;
  transactions: string[];
  uncles: string[];
}

export interface Transaction {
  hash: string;
  nonce: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  value: string;
  gas: number;
  gasPrice: string;
  input: string;
}

export interface TxReceipt {
  status: boolean;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  cumulativeGasUsed: number;
  gasUsed: number;
  logs: EventLog[];
}

interface EventLog {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  removed: boolean;
  topics: string[];
  transactionHash: string[];
  transactionIndex: number;
  id: string;
}
