import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// agent
import DbAgent from '../../common/agent/DbAgent';
import RegistryAgent from '../../registry/agent/RegistryAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// model
import {
  AbiElement,
  ConvertedAbi,
  ABI_TYPE_EVENT,
  ABI_TYPE_FUNCTION,
} from '../../../../shared/contract/model/Contract';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

class RayonArtifactAgent {
  private _convertedAbi: ConvertedAbi = {};

  public startArtifactConvert(): void {
    RegistryAgent.getContractAddrList().forEach(contractAddress => {
      const contractAbi = this._getContractArtifact(contractAddress).abi;
      contractAbi.forEach(abiElement => {
        this._convertAndStoreAbi(contractAddress, abiElement);
      });
    });
  }

  private _getContractArtifact(contractAddress: string) {
    const contractPath = `../../../../shared/build/${process.env.ENV_BLOCKCHAIN}/${contractAddress}.json`;
    return JSON.parse(fs.readFileSync(path.join(__dirname, contractPath), 'utf8'));
  }

  private _convertAndStoreAbi(contractAddress: string, abiElement: AbiElement): void {
    const isNotFunctionOrEvent = !(abiElement.type === ABI_TYPE_EVENT || abiElement.type === ABI_TYPE_FUNCTION);
    const isFallbackEvent = abiElement.type === ABI_TYPE_EVENT && abiElement.name === undefined;
    if (isFallbackEvent || isNotFunctionOrEvent) return; // skip fallBack

    const parameterTypes = ArrayUtil.isEmpty(abiElement.inputs)
      ? ''
      : abiElement.inputs.map(input => input.type).join(',');

    const signature =
      abiElement.type === ABI_TYPE_EVENT
        ? Web3Controller.getWeb3().eth.abi.encodeEventSignature(abiElement)
        : Web3Controller.getWeb3().eth.abi.encodeFunctionSignature(abiElement);

    this._convertedAbi[contractAddress] = {
      ...this._convertedAbi[contractAddress],
      [signature]: {
        inputs: abiElement.inputs,
        name: `${abiElement.name}(${parameterTypes})`,
        type: abiElement.type,
      },
    };
  }

  public isAbiDataExist(address: string, signature: string): boolean {
    return !(this._convertedAbi[address] === undefined || this._convertedAbi[address][signature] === undefined);
  }

  // getter

  public getFullName(contractAddress: string, signature: string) {
    if (!this.isAbiDataExist(contractAddress, signature)) return;
    return this._convertedAbi[contractAddress][signature].name;
  }

  public getInputs(contractAddress: string, signature: string) {
    if (!this.isAbiDataExist(contractAddress, signature)) return;
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
