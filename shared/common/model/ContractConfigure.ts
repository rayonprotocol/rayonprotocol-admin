class ContractConfigure {
  public static ENV_DEV: string = 'dev';
  public static ENV_TESTNET: string = 'ropsten';
  public static ENV_MAIN: string = 'main';
  public static NETWORK_PORT: number = 8545;

  public static ROPSTEN_NETWORK_ID = 3;

  public static PROVIDER_METAMASK: string = 'metamask';
  public static PROVIDER_INFURA: string = 'infura';
  public static PROVIDER_LOCALHOST: string = 'localhost';

  public static AUTOMAITC_REQUEST_TIME_INTERVAL: number = 2000;

  private static websocketUrl = {
    dev: 'http://localhost:8545',
    ropsten: 'wss://ropsten.infura.io/ws',
    rinkeby: 'wss://rinkeby.infura.io/ws',
    mainnet: 'wss://mainnet.infura.io/ws',
  };

  private static httpUrl = {
    dev: 'http://localhost:8545',
    ropsten: 'https://ropsten.infura.io/',
    rinkeby: 'https://rinkeby.infura.io/',
    mainnet: 'https://mainnet.infura.io/',
  };

  public static getWebsocketUrl(blockchainEnv: string) {
    return ContractConfigure.websocketUrl[blockchainEnv];
  }

  public static getHttpUrl(blockchainEnv: string) {
    return ContractConfigure.httpUrl[blockchainEnv];
  }
}

export default ContractConfigure;
