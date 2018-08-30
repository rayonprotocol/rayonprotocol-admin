import readEnv from 'read-env';
import Environment from '../../../../shared/common/model/Environment';

// for use .env variables
require('dotenv').config();

class ContractProvider {
  public makeHdWalletProvider(providerUrl, addressIndex = 0, numAddresses = 5) {
    const HDWalletProvider = require('truffle-hdwallet-provider');
    return new HDWalletProvider(process.env.MNEMONIC, providerUrl, addressIndex, numAddresses);
  }

  public getProvider() {
    if (process.env.ENV_BLOCKCHAIN === Environment.ENV_LOCAL)
      return this.makeHdWalletProvider(`http://localhost:${Environment.NETWORK_PORT}`);
    else if (process.env.ENV_BLOCKCHAIN === Environment.ENV_TESTNET)
      return this.makeHdWalletProvider(`https://ropsten.infura.io/${process.env.INFURA_API_KEY}`);
    else console.error('BLOCKCHAIN ENV is not match');
  }
}
export default new ContractProvider();
