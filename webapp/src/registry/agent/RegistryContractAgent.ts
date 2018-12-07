import Web3Controller from 'common/dc/Web3Controller';
import { txResultToArr, mapDateProp } from 'common/util/txResult';
import { RegistryInfo } from '../../../../shared/registry/model/Registry';
import { Contract } from 'web3/types';

const artifacts = {
  Registry: require('../../../../dev/contract/.volume/registry/Registry.json'),
};

class RegistryContractAgent {
  static getInstanceFromAbi = (artifact) => {
    return new (Web3Controller.getWeb3()).eth.Contract(artifact.abi, artifact.networks['9999'].address);

  }
  private registry: Contract = RegistryContractAgent.getInstanceFromAbi(artifacts.Registry);

  public getRegistryInfo = async (contractName: string): Promise<RegistryInfo> => {
    const result = await this.registry.methods.getRegistryInfo(contractName).call();
    const [name, contractAddress, interfaceAddress, version, blockNumber, updatedEpochTime] = txResultToArr(result)
    const registryInfo = mapDateProp('updatedEpochTime', 'updatedDate')({
      name, contractAddress, interfaceAddress, version: Number(version), blockNumber: Number(blockNumber), updatedEpochTime,
    });

    return registryInfo;
  }
}

export default new RegistryContractAgent();