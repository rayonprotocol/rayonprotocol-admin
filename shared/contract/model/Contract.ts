import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';

export const URLForGetContractLogs = `${parentUrl}/contracts/logs/`;
export const URLForGetAllContracts = `${parentUrl}/contracts/`;
export const URLForGetAllOwner = `${parentUrl}/contracts/owners/`;

export const ABI_TYPE_FUNCTION: string = 'function';
export const ABI_TYPE_EVENT: string = 'event';

export interface newContract {
  name: string;
  proxyAddress: string;
  interfaceAddress: string;
  version: number;
  blockNumber: number;
  updatedAt: number;
}

export default interface Contract {
  address: string;
  name: string;
  owner: string;
  deployedBlockNumber: number;
}

export type ConvertedAbi = {
  [contractAddress: string]: {
    [signiture: string]: ConvertedAbiData;
  };
};

interface ConvertedAbiData {
  name: string;
  inputs: object[];
  type: string;
}

export interface AbiElement {
  constant: boolean;
  inputs: any[];
  name: string;
  outputs: any[];
  paryable: boolean;
  stateMutability: string;
  type: string;
}
