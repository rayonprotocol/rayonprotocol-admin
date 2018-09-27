import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// model
import RayonArtifact from '../../common/model/RayonArtifact';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class RayonArtifactAgent {
  private _getContractArtifact(contractAddress: string) {
    const contractPath = `../../../../shared/build/${process.env.ENV_BLOCKCHAIN}/${contractAddress}.json`;
    return JSON.parse(fs.readFileSync(path.join(__dirname, contractPath), 'utf8'));
  }

  private _getAbiFromArtifact(contractArtifact: RayonArtifact) {
    return contractArtifact.abi;
  }

  private _getContractAddressFromArtifact(contractArtifact: RayonArtifact) {
    return contractArtifact.networks[ContractConfigure.ROPSTEN_NETWORK_ID].address;
  }

  public getContractInstance(web3: Web3, contractAddress: string) {
    const contractArtifact = this._getContractArtifact(contractAddress);
    return new web3.eth.Contract(
      this._getAbiFromArtifact(contractArtifact),
      this._getContractAddressFromArtifact(contractArtifact)
    );
  }
}

export default new RayonArtifactAgent();
