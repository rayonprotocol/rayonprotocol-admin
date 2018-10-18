import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';
import ContractConfigure from '../../common/model/ContractConfigure';

export const URLForGetAllLogs = `${parentUrl}/contract/logs/all`;
export const URLForGetContractLogs = `${parentUrl}/contract/logs`;
export const URLForGetContractOverview = `${parentUrl}/contract/overview`;

export type ContractOverview = {
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

export interface AbiElement {
  constant: boolean;
  inputs: any[];
  name: string;
  outputs: any[];
  paryable: boolean;
  stateMutability: string;
  type: string;
}

export default class Contract {
  public static ABI_TYPE_FUNCTION = 'function';
  public static ABI_TYPE_EVENT = 'event';

  _contractOverviews: ContractOverview;

  constructor() {
    this._contractOverviews = {
      [ContractConfigure.ADDR_RAYONTOKEN]: {
        name: 'Rayon Token',
        owner: ContractConfigure.ADMIN_RAYONTOKEN,
      },
      // ['asdfasdfasdf']: {
      //   name: 'Rayon Test',
      //   owner: 'asdf123123',
      // },
    };
  }

  public getAllContractOverview() {
    return this._contractOverviews;
  }

  public getContractAddressList(): string[] {
    return Object.keys(this._contractOverviews);
  }
}
