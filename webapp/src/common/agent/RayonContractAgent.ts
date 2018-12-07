import RegistryContractAgent from 'registry/agent/RegistryContractAgent';
import Web3Controller from 'common/dc/Web3Controller';
import AsyncInitiatable from 'common/util/AsyncInitiatable';

export default class RayonContractAgent extends AsyncInitiatable {
  static getInstance = async (artifact) => {
    const registryInfo = await RegistryContractAgent.getRegistryInfo(artifact.contractName);
    return new (Web3Controller.getWeb3()).eth.Contract(artifact.abi, registryInfo.contractAddress);
  }
}
