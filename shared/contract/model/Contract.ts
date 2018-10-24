import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';
import ContractConfigure from '../../common/model/ContractConfigure';

export const URLForGetAllLogs = `${parentUrl}/contract/logs/all`;
export const URLForGetContractLogs = `${parentUrl}/contract/logs`;
export const URLForGetContractOverview = `${parentUrl}/contract/overview`;

type ContractEnvOverview = {
  [env: string]: ContractOverview;
};

export type ContractOverview = {
  [contractAddress: string]: {
    name: string;
    owner: string;
    blockNumber: number;
  };
};

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

  public static CONTRACT_RAYONTOKEN = 'RayonToken';

  _contractEnvOverview: ContractEnvOverview;
  _contractOverviews: ContractOverview;

  constructor(env: string) {
    this._contractEnvOverview = {
      [ContractConfigure.ENV_LOCAL]: {
        '0x87734414f6fe26c3fff5b3fa69d379be4c0a2056': {
          name: Contract.CONTRACT_RAYONTOKEN,
          owner: '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290',
          blockNumber: 0,
        },
      },
      [ContractConfigure.ENV_TESTNET]: {
        '0xf9a8a966d310cb240c4edc98ca43eb7ff1c5d491': {
          name: Contract.CONTRACT_RAYONTOKEN,
          owner: '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290',
          blockNumber: 3936488,
        },
      },
    };
    this._contractOverviews = this._contractEnvOverview[env];
  }

  public getStartBlockNumber() {
    return Math.min.apply(
      null,
      this.getContractAddressList().map(overview => this._contractOverviews[overview].blockNumber)
    );
  }

  public getAllContractOverview() {
    return this._contractOverviews;
  }

  public getContractAddressList(): string[] {
    return Object.keys(this._contractOverviews);
  }

  public getContractAddrByName(contractName: string) {
    const addrList = this.getContractAddressList();
    const result = addrList.filter(addr => this._contractOverviews[addr].name === contractName);
    return result.length ? result.pop() : null;
  }
}