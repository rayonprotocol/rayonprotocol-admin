import { BigNumber } from 'bignumber.js';
import { relativeUrl as parentUrl } from '../../interface/Ajax';
import ContractConfigure from '../../common/model/ContractConfigure';

export const URLForGetFunctionLogs = `${parentUrl}/log/function`;
export const URLForGetEventLogs = `${parentUrl}/log/event`;

export const ABI_TYPE_FUNCTION = 'function';
export const ABI_TYPE_EVENT = 'event';

export default interface Contract {
  address: string;
  name: string;
  owner: string;
}

export interface ContractAbi {
  contractAddress: string;
  inputs: string;
  name: string;
  type: string;
  signature: string;
}

export function getRayonContracts(): Contract[] {
  const constracts = [
    {
      address: ContractConfigure.ADDR_RAYONTOKEN,
      name: 'Rayon Token',
      owner: ContractConfigure.ADMIN_RAYONTOKEN,
    },
  ];
  return constracts;
}
