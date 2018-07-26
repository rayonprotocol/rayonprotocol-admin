import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// dc
import TokenDC from '../../token/dc/TokenDC';
import MintEventDC from '../../event/dc/MintEventDC';
import TransferEventDC from '../../event/dc/TransferEventDC';

class ContractDC {
  private web3: Web3;
  private tokenContractInstance;

  init() {
    const Web3 = require('web3');
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    this.web3 = new Web3(provider);
    this.getDeployedContract();
  }

  async getDeployedContract() {
    const TruffleContract = require('truffle-contract');

    const artifaction = fs.readFileSync(
      path.join(__dirname, '../../../../webapp/build/contracts/RayonToken.json'),
      'utf8'
    );
    const contract = TruffleContract(JSON.parse(artifaction));
    contract.setProvider(this.web3.currentProvider);
    if (typeof contract.currentProvider.sendAsync !== 'function') {
      contract.currentProvider.sendAsync = function() {
        return contract.currentProvider.send.apply(contract.currentProvider, arguments);
      };
    }
    this.tokenContractInstance = await contract.deployed();
    this.attachEvent();
  }

  attachEvent() {
    MintEventDC.attachTokenEvent(this.tokenContractInstance.Mint);
    TransferEventDC.attachTokenEvent(this.tokenContractInstance.Transfer);
  }

  public getWeb3() {
    return this.web3;
  }

  public getTokenContractInstance() {
    return this.tokenContractInstance;
  }
}

export default new ContractDC();
