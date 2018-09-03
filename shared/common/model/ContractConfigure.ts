class ContractConfigure {
  public static ADDR_RAYONTOKEN = '0xf9a8a966d310cb240c4edc98ca43eb7ff1c5d491';

  public static ENV_LOCAL = 'local';
  public static ENV_TESTNET = 'ropsten';
  public static ENV_MAIN = 'main';
  public static NETWORK_PORT = 8545;

  public static CONTRACTBLOCK_LOCAL = 0;
  public static CONTRACTBLOCK_TESTNET = 3936470;
  public static CONTRACTBLOCK_MAINNET = 3936470;

  private static url = {
    development: 'http://localhost:8545',
    ropsten: 'wss://ropsten.infura.io/ws',
    rinkeby: 'wss://rinkeby.infura.io/ws',
    mainnet: 'wss://mainnet.infura.io/ws',
  };

  public static getNodeUrl(blockchainEnv: string) {
    return ContractConfigure.url[blockchainEnv];
  }
}

export default ContractConfigure;
