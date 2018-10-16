import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// agent
import DbAgent from '../../common/agent/DbAgent';
import RayonLogDbAgent from './RayonLogDbAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// model
import { artifactAbi, ConvertedAbi } from '../model/RayonArtifact';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';
import Contract, {
  ContractAbi,
  ABI_TYPE_FUNCTION,
  ABI_TYPE_EVENT,
  getRayonContracts,
} from '../../../../shared/contract/model/Contract';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import ContractUtil from '../../common/util/ContractUtil';

class RayonArtifactAgent {
  private _convertedFunctionAbi: ConvertedAbi = {};
  private _convertedEventAbi: ConvertedAbi = {};

  constructor() {
    getRayonContracts().forEach(this._verifyAndConvertContract.bind(this));
  }

  private async _verifyAndConvertContract(contract: Contract): Promise<void> {
    const isContractResistered = await RayonLogDbAgent.isRayonContract(contract.address);
    if (isContractResistered) return;

    await RayonLogDbAgent.storeContract(contract);

    const contractArtifactAbi = this._getContractArtifact(contract.address).abi;
    contractArtifactAbi.forEach(abi => {
      this._convertAndStoreAbi(contract.address, abi);
    });
  }

  private _getContractArtifact(contractAddress: string) {
    const contractPath = `../../../../shared/build/${process.env.ENV_BLOCKCHAIN}/${contractAddress}.json`;
    return JSON.parse(fs.readFileSync(path.join(__dirname, contractPath), 'utf8'));
  }

  private _convertAndStoreAbi(contractAddress: string, abi: artifactAbi) {
    const isNotFunctionOrEvent = !(abi.type === ABI_TYPE_EVENT || abi.type === ABI_TYPE_FUNCTION);
    const isFallbackEvent = abi.type === ABI_TYPE_EVENT && abi.name === undefined;
    if (isFallbackEvent || isNotFunctionOrEvent) return; // skip fallBack

    const parameterTypes = ArrayUtil.isEmpty(abi.inputs) ? '' : abi.inputs.map(input => input.type).join(',');

    const signature =
      abi.type === ABI_TYPE_EVENT
        ? Web3Controller.getWeb3().eth.abi.encodeEventSignature(abi)
        : Web3Controller.getWeb3().eth.abi.encodeFunctionSignature(abi);

    const contractAbi: ContractAbi = {
      contractAddress,
      inputs: JSON.stringify(abi.inputs),
      name: `${abi.name}(${parameterTypes})`,
      type: abi.type,
      signature,
    };

    RayonLogDbAgent.storeContractAbi(contractAbi);
  }

  public getContractInstance(contractAddress: string) {
    const contractArtifact = this._getContractArtifact(contractAddress);
    return Web3Controller.getWeb3().eth.Contract(contractArtifact.abi, contractAddress);
  }
}

export default new RayonArtifactAgent();
