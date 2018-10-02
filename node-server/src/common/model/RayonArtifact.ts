export default interface RayonArtifact {
  contractName: string;
  abi: artifactAbi[];
  networks: artifactNetworks;
}

export interface artifactAbi {
  constant: boolean;
  inputs: any[];
  name: string;
  outputs: any[];
  paryable: boolean;
  stateMutability: string;
  type: string;
}

type artifactNetworks = {
  [networkNumber: string]: {
    events: object;
    links: object;
    address: string;
    transactionHash: string;
  };
};

export type ConvertedAbiFunctions = {
  [functionSignature: string]: ConvertedAbiFunction;
};

interface ConvertedAbiFunction {
  fullName: string;
  inputs: object;
}

export type ConvertedAbiEvents = {
  [eventName: string]: ConvertedAbiFunction;
};

export type ConvertedAbi = {
  [contractAddress: string]: {
    convertedAbiFunctions: ConvertedAbiFunctions;
    convertedAbiEvents: ConvertedAbiEvents;
  };
};
