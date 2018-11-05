import { BigNumber } from 'bignumber.js';

class ContractUtil {
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
}

export default new ContractUtil();
