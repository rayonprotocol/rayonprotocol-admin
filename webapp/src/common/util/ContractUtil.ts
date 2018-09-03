import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class ContractUtil {
  public getContract(contractAddress: string) {
    return require(`../../../../shared/build/${ENV_BLOCKCHAIN}/${contractAddress}.json`);
  }

  public getProvider() {
    const Web3 = require('web3');
    const nodeUrl: Object = ContractConfigure.getNodeUrl(ENV_BLOCKCHAIN);
    return new Web3.providers.WebsocketProvider(nodeUrl);
  }

  public getContractBlock(): number {
    if (ENV_BLOCKCHAIN === ContractConfigure.ENV_LOCAL) return ContractConfigure.CONTRACTBLOCK_LOCAL;
    else if (ENV_BLOCKCHAIN === ContractConfigure.ENV_TESTNET) return ContractConfigure.CONTRACTBLOCK_TESTNET;
    else if (ENV_BLOCKCHAIN === ContractConfigure.ENV_MAIN) return ContractConfigure.CONTRACTBLOCK_MAINNET;
    else {
      console.error('undefined blockchain evironment, please chech evironment value');
      return;
    }
  }
}
export default new ContractUtil();
