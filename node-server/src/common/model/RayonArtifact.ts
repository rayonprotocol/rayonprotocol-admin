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
  [functionName: string]: ConvertedAbiFunction;
};

interface ConvertedAbiFunction {
  fullNames: string;
  inputs: object;
}
