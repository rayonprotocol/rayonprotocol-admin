import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';
import ContractConfigure from '../../common/model/ContractConfigure';

export const URLForGetFunctionLogs = `${parentUrl}/log/function`;
export const URLForGetEventLogs = `${parentUrl}/log/event`;

export const ABI_TYPE_FUNCTION = 'function';
export const ABI_TYPE_EVENT = 'event';

export type ContractInfo = {
  [contractAddress: string]: {
    name: string;
    owner: string;
  };
};

export interface ContractAbi {
  contractAddress: string;
  inputs: string;
  name: string;
  type: string;
  signature: string;
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

export interface artifactAbi {
  constant: boolean;
  inputs: any[];
  name: string;
  outputs: any[];
  paryable: boolean;
  stateMutability: string;
  type: string;
}

export default class Contract {
  _contracts: ContractInfo;

  constructor() {
    this._contracts = {
      [ContractConfigure.ADDR_RAYONTOKEN]: {
        name: 'Rayon Token',
        owner: ContractConfigure.ADMIN_RAYONTOKEN,
      },
    };
  }

  public getAllContractInfo() {
    return this._contracts;
  }

  public getContractAddressList(): string[] {
    return Object.keys(this._contracts);
  }
}
