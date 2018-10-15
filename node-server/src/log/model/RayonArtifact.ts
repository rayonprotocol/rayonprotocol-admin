export interface artifactAbi {
  constant: boolean;
  inputs: any[];
  name: string;
  outputs: any[];
  paryable: boolean;
  stateMutability: string;
  type: string;
}

interface ConvertedAbiData {
  fullName: string;
  inputs: object[];
}

export type ConvertedAbi = {
  [contractAddress: string]: {
    [signiture: string]: ConvertedAbiData;
  };
};
