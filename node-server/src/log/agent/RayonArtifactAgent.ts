import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// agent
import DbAgent from '../../common/agent/DbAgent';
import RayonLogDbAgent from './RayonLogDbAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';
import Contract, {
  ContractAbi,
  artifactAbi,
  ConvertedAbi,
  ABI_TYPE_FUNCTION,
  ABI_TYPE_EVENT,
} from '../../../../shared/contract/model/Contract';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import ContractUtil from '../../common/util/ContractUtil';

class RayonArtifactAgent {
  private _contract: Contract = new Contract();
  private _convertedAbi: ConvertedAbi = {};

  public startArtifactConvert(): void {
    this._contract.getContractAddressList().forEach(this._verifyAndConvertContract.bind(this));
  }

  private async _verifyAndConvertContract(contractAddress: string): Promise<void> {
    const contractArtifactAbi = this._getContractArtifact(contractAddress).abi;
    contractArtifactAbi.forEach(abi => {
      this._convertAndStoreAbi(contractAddress, abi);
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

    this._convertedAbi[contractAddress] = {
      ...this._convertedAbi[contractAddress],
      [signature]: {
        inputs: abi.inputs,
        name: `${abi.name}(${parameterTypes})`,
        type: abi.type,
      },
    };
  }

  public isRayonContract(contractAddress: string) {
    if (contractAddress === null) return;
    return this._contract.getContractAddressList().indexOf(contractAddress.toLowerCase()) > -1;
  }

  public isUndefinedAbiData(contractAddress: string, signature: string) {
    if (this._convertedAbi[contractAddress] === undefined) {
      console.log('Waring: this is unsaved contract address');
      return true;
    } else if (this._convertedAbi[contractAddress][signature] === undefined) {
      console.log('Waring: this is unsaved signatrue');
      return true;
    }
    return false;
  }

  public getContractInstance(contractAddress: string) {
    const contractArtifact = this._getContractArtifact(contractAddress);
    return Web3Controller.getWeb3().eth.Contract(contractArtifact.abi, contractAddress);
  }

  public getFullName(contractAddress: string, signature: string) {
    if (this.isUndefinedAbiData(contractAddress, signature)) return;
    return this._convertedAbi[contractAddress][signature].name;
  }

  public getInputs(contractAddress: string, signature: string) {
    if (this.isUndefinedAbiData(contractAddress, signature)) return;
    return this._convertedAbi[contractAddress][signature].inputs;
  }

  public getParameters(contractAddress: string, signature: string, parameters: string) {
    const inputs = this.getInputs(contractAddress, signature);
    if (ArrayUtil.isEmpty(inputs)) return;

    const decodeParameters = Web3Controller.getWeb3().eth.abi.decodeParameters(inputs, parameters);
    const resultInput = {};

    inputs.forEach(inputName => {
      resultInput[inputName['name']] = decodeParameters[inputName['name']];
    });
    return JSON.stringify(resultInput);
  }
}

export default new RayonArtifactAgent();
