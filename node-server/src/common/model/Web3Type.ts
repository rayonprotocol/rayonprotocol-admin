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
  logs: string[];
}

export interface PastLog {
  data: string;
  topics: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
}

export interface PastEvent {
  returnValues: object;
  raw: EventRaw;
  event: string;
  signature: string;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
}

export interface EventRaw {
  data: string | string[];
  topics: string[];
}
