export interface FunctionHistory {
  txHash: string;
  calledTime: number;
  contractAddress: string;
  functionName: string;
  inputData: string;
}

export interface EventHistory {
  txHash: string;
  calledTime: number;
  contractAddress: string;
  eventName: string;
}
