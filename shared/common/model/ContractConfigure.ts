class ContractConfigure {
  public static ADDR_CONTRACT_ADMIN: string = '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290';

  public static ADDR_RAYONTOKEN: string = '0xf9a8a966d310cb240c4edc98ca43eb7ff1c5d491';
  public static ADDR_TEST: string = '0xf9a8a966d310cb240c4edc98ca43eb7ff1c5d492';

  public static ENV_LOCAL: string = 'local';
  public static ENV_TESTNET: string = 'ropsten';
  public static ENV_MAIN: string = 'main';
  public static NETWORK_PORT: number = 8545;

  public static ROPSTEN_NETWORK_ID = 3;

  // TODO: 블록체인에서 얻어와야함
  public static CONTRACTBLOCK_LOCAL: number = 0;
  public static CONTRACTBLOCK_TESTNET: number = 3936470;
  public static CONTRACTBLOCK_MAINNET: number = 3936470;

  public static PROVIDER_METAMASK: string = 'metamask';
  public static PROVIDER_INFURA: string = 'infura';
  public static PROVIDER_LOCALHOST: string = 'localhost';

  public static AUTOMAITC_REQUEST_TIME_INTERVAL: number = 2000;

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

  public static getContractName(constractAddress: string) {}

  public static getOwnerAddresses(): Map<string, string> {
    const ownerAddresses = new Map<string, string>();
    ownerAddresses.set(ContractConfigure.ADDR_RAYONTOKEN, ContractConfigure.ADDR_CONTRACT_ADMIN);
    ownerAddresses.set(ContractConfigure.ADDR_TEST, 'TEST');
    return ownerAddresses;
  }

  public static getRayonContractAddresses(): Map<string, string> {
    const RayonContractAddresses = new Map<string, string>();
    RayonContractAddresses.set(ContractConfigure.ADDR_RAYONTOKEN, 'RAYON TOKEN');
    RayonContractAddresses.set(ContractConfigure.ADDR_TEST, 'TEST');
    return RayonContractAddresses;
  }
}

export default ContractConfigure;
