class ContractConfigure {

  public static ADDR_CONTRACT_ADMIN = '';

  public static ADDR_RAYONTOKEN = '0xf9a8a966d310cb240c4edc98ca43eb7ff1c5d491';

  public static ENV_LOCAL = 'local';
  public static ENV_TESTNET = 'ropsten';
  public static ENV_MAIN = 'main';
  public static NETWORK_PORT = 8545;

  public static CONTRACTBLOCK_LOCAL = 0;
  public static CONTRACTBLOCK_TESTNET = 3936470;
  public static CONTRACTBLOCK_MAINNET = 3936470;

  public static PROVIDER_METAMASK = 'metamask';
  public static PROVIDER_INFURA = 'infura';
  public static PROVIDER_LOCALHOST = 'localhost';

  public static AUTOMAITC_REQUEST_TIME_INTERVAL = 2000;

  private static websocketUrl = {
    development: 'http://localhost:8545',
    ropsten: 'wss://ropsten.infura.io/ws',
    rinkeby: 'wss://rinkeby.infura.io/ws',
    mainnet: 'wss://mainnet.infura.io/ws',
  };

  private static httpUrl = {
    development: 'http://localhost:8545',
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
