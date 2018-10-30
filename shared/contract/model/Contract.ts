import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';
import ContractConfigure from '../../common/model/ContractConfigure';

export const URLForGetAllLogs = `${parentUrl}/contracts/logs/`;
export const URLForGetContractLogs = `${parentUrl}/contracts/:address/logs/:type`;
export const URLForGetAllContracts = `${parentUrl}/contracts/`;
export const URLForGetAllOwner = `${parentUrl}/contracts/owners/`;

export const ABI_TYPE_FUNCTION: string = 'function';
export const ABI_TYPE_EVENT: string = 'event';

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
