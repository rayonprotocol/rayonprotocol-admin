type artifactNetworks = {
  [networkNumber: string]: {
    events: object;
    links: object;
    address: string;
    transactionHash: string;
  };
};

export interface artifactAbi {
  constant: boolean;
  inputs: any[];
  name: string;
  outputs: any[];
  paryable: boolean;
  stateMutability: string;
  type: string;
}

export default interface RayonArtifact {
  contractName: string;
  abi: artifactAbi[];
  networks: artifactNetworks;
}
