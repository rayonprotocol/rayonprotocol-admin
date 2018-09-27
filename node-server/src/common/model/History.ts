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

export interface FunctionHistory {
  calledTime: number;
  txHash: string;
  contractAddress: string;
  functionName: string;
  inputData: string;
}

export interface EventHistory {
  txHash: string;
  contract_address: string;
  eventName: string;
  functionName: string;
  inputData: string;
}
