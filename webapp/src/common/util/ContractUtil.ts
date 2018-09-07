import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class ContractUtil {
  public getContractArtifact(contractAddress: string) {
    return require(`../../../../shared/build/${ENV_BLOCKCHAIN}/${contractAddress}.json`);
  }

  public getWebsocketProvider() {
    const Web3 = require('web3');
    const url: Object = ContractConfigure.getWebsocketUrl(ENV_BLOCKCHAIN);
    return new Web3.providers.WebsocketProvider(url);
  }

  public getHttpProvider() {
    const Web3 = require('web3');
    const url: Object = ContractConfigure.getHttpUrl(ENV_BLOCKCHAIN) + ``;
    return new Web3.providers.HttpProvider(url);
  }

  public getContractDeployedBlock(): number {
    if (ENV_BLOCKCHAIN === ContractConfigure.ENV_LOCAL) return ContractConfigure.CONTRACTBLOCK_LOCAL;
    else if (ENV_BLOCKCHAIN === ContractConfigure.ENV_TESTNET) return ContractConfigure.CONTRACTBLOCK_TESTNET;
    else if (ENV_BLOCKCHAIN === ContractConfigure.ENV_MAIN) return ContractConfigure.CONTRACTBLOCK_MAINNET;
    else {
      console.error('undefined blockchain evironment, please chech evironment value');
      return;
    }
  }

  public getAbiFromArtifact(contract) {
    return contract['abi'];
  }

  public getContractAddressFromArtifact(contract) {
    const ROPSTEN_NETWORK_ID = 3;
    return contract['networks'][ROPSTEN_NETWORK_ID]['address'];
  }
}

export default new ContractUtil();
