export interface FunctionHistory {
  blockNumber: number;
  txHash: string;
  status: boolean;
  contractAddress: string;
  functionName: string;
  inputData: string;
  calledTime: number;
}

export interface EventHistory {
  blockNumber: number;
  txHash: string;
  status: boolean;
  contractAddress: string;
  eventName: string;
  functionName: string;
  inputData: string;
  calledTime: number;
}

export default interface TxHistory {
  functionHistory: FunctionHistory;
  eventHistories: EventHistory[];
}
