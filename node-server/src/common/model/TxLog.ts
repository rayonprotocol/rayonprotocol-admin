export interface FunctionLog {
  blockNumber: number;
  txHash: string;
  status: boolean;
  contractAddress: string;
  functionName: string;
  inputData: string;
  calledTime: number;
}

export interface EventLog {
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
  functionLog: FunctionLog;
  eventLogs: EventLog[];
}
