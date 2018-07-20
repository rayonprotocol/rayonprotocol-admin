import Web3 from 'web3';

import TokenDC from '../../token/dc/TokenDC';

class ContractDC {
  private web3: Web3;
  private tokenContractInstance;

  init() {
    const Web3 = require('web3');
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    this.web3 = new Web3(provider);
    this.getTokenContract();
  }

  async getTokenContract() {
    const fs = require('fs');
    const path = require('path');
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
    TokenDC.attachTokenMintEvent(this.tokenContractInstance);
    TokenDC.attachTokenTransferEvent(this.tokenContractInstance);
  }

  public getWeb3() {
    return this.web3;
  }

  public getTokenContractInstance() {
    return this.tokenContractInstance;
  }
}

export default new ContractDC();
