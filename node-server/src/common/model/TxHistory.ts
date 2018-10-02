export interface FunctionHistory {
  txHash: string;
  calledTime: number;
  status: boolean;
  contractAddress: string;
  functionName: string;
  inputData: string;
}

export interface EventHistory {
  txHash: string;
  calledTime: number;
  status: boolean;
  contractAddress: string;
  eventName: string;
  functionName: string;
  inputData: string;
}

export default interface TxHistory {
  functionHistory: FunctionHistory;
  eventHistories: EventHistory[];
}
