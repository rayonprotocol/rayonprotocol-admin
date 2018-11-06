import { BigNumber } from 'bignumber.js';

class ContractUtil {
  public ADDR_ZERO = '0x0000000000000000000000000000000000000000';
  public ADDR_REGISTRY = '0xf9a8a966d310cb240c4edc98ca43eb7ff1c5d491';

  public AUTOMAITC_REQUEST_TIME_INTERVAL: number = 2000;

  public ROPSTEN_NETWORK_ID = 3;

  public PROVIDER_METAMASK: string = 'metamask';
  public PROVIDER_INFURA: string = 'infura';
  public PROVIDER_LOCALHOST: string = 'localhost';

  public ENV_DEV = 'dev';
  public ENV_TESTNET = 'ropsten';

  private httpUrl = {
    dev: 'http://localhost:8545',
    ropsten: 'https://ropsten.infura.io/',
    rinkeby: 'https://rinkeby.infura.io/',
    mainnet: 'https://mainnet.infura.io/',
  };

  public getHttpUrl(blockchainEnv: string) {
    return this.httpUrl[blockchainEnv];
  }

  public weiToToken = wei => {
    return new BigNumber(wei).dividedBy(new BigNumber(10).pow(18));
  };

  public getContractArtifact(blockchainEnv: string, contractAddress: string) {
    return require(`../../build/${blockchainEnv}/${contractAddress}.json`);
  }

  public getAdminList() {
    return ['0x63d49dae293ff2f077f5cda66be0df251a0d3290'];
  }
}

export default new ContractUtil();
