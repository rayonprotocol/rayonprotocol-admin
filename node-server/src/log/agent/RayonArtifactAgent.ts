import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

import ContractUtil from '../../common/util/ContractUtil';

// model
import { artifactAbi, ConvertedAbi } from '../model/RayonArtifact';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

class RayonArtifactAgent {
  private static ABI_TYPE_FUNCTION = 'function';
  private static ABI_TYPE_EVENT = 'event';

  private _web3: Web3;
  private _contracts: string[];
  private _convertedFunctionAbi: ConvertedAbi = {};
  private _convertedEventAbi: ConvertedAbi = {};

  constructor() {
    this._setWeb3();
    this._contracts = Array.from(ContractConfigure.getRayonContractAddresses().values());
    this._contracts.forEach(this._classifyAndConvertAbi.bind(this));
  }

  private _setWeb3(): void {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private _classifyAndConvertAbi(contractAddress: string): void {
    const contractArtifactAbi = this._getContractArtifact(contractAddress).abi;
    contractArtifactAbi.forEach(abi => {
      abi.type === RayonArtifactAgent.ABI_TYPE_FUNCTION
        ? this._convertAbiFunction(contractAddress, abi)
        : this._convertAbiEvent(contractAddress, abi);
    });
  }

  private _convertAbiFunction(contractAddress: string, abi: artifactAbi): void {
    const parameterTypes = ArrayUtil.isEmpty(abi.inputs) ? '' : abi.inputs.map(input => input.type).join(',');
    const functionSignature = this._web3.eth.abi.encodeFunctionSignature(abi);

    if (this._convertedFunctionAbi[contractAddress] === undefined) this._convertedFunctionAbi[contractAddress] = {};

    this._convertedFunctionAbi[contractAddress][functionSignature] = {
      fullName: `${abi.name}(${parameterTypes})`,
      inputs: abi.inputs,
    };
  }

  private _convertAbiEvent(contractAddress: string, abi: artifactAbi): void {
    if (abi.name === undefined) return; // skip fallBack
    const parameterTypes = ArrayUtil.isEmpty(abi.inputs) ? '' : abi.inputs.map(input => input.type).join(',');
    const eventSignature = this._web3.eth.abi.encodeEventSignature(abi);

    if (this._convertedEventAbi[contractAddress] === undefined) this._convertedEventAbi[contractAddress] = {};

    this._convertedEventAbi[contractAddress][eventSignature] = {
      fullName: `${abi.name}(${parameterTypes})`,
      inputs: abi.inputs,
    };
  }

  private _getContractArtifact(contractAddress: string) {
    const contractPath = `../../../../shared/build/${process.env.ENV_BLOCKCHAIN}/${contractAddress}.json`;
    return JSON.parse(fs.readFileSync(path.join(__dirname, contractPath), 'utf8'));
  }

  private _isConvertedAbiFunctionEmpty(contractAddress: string, functionSignature: string): boolean {
    return (
      this._convertedFunctionAbi[contractAddress] === undefined ||
      this._convertedFunctionAbi[contractAddress][functionSignature] === undefined
    );
  }

  private _isConvertedAbiEventEmpty(contractAddress: string, eventSignature: string): boolean {
    return (
      this._convertedEventAbi[contractAddress] === undefined ||
      this._convertedEventAbi[contractAddress][eventSignature] === undefined
    );
  }

  public getContractInstance(contractAddress: string) {
    const contractArtifact = this._getContractArtifact(contractAddress);
    return this._web3.eth.Contract(contractArtifact.abi, contractAddress);
  }

  public getEventFullName(contractAddress: string, eventSignature: string): string {
    if (this._isConvertedAbiEventEmpty(contractAddress, eventSignature)) return;
    return this._convertedEventAbi[contractAddress][eventSignature].fullName;
  }

  public getEventInputs(contractAddress: string, eventSignature: string) {
    if (this._isConvertedAbiEventEmpty(contractAddress, eventSignature)) return;
    return this._convertedEventAbi[contractAddress][eventSignature].inputs;
  }

  public getEventParameters(contractAddress: string, eventSignature: string, parameters: string): object {
    const eventInputs = this.getEventInputs(contractAddress, eventSignature);
    if (eventInputs === undefined) return;
    const decodeParameters = this._web3.eth.abi.decodeParameters(eventInputs, `0x${parameters}`);
    const resultInput = {};
    eventInputs.forEach(inputName => {
      resultInput[inputName['name']] = decodeParameters[inputName['name']];
    });
    return resultInput;
  }

  public getFunctionFullName(contractAddress: string, functionSignature: string): string {
    if (this._isConvertedAbiFunctionEmpty(contractAddress, functionSignature)) return;
    return this._convertedFunctionAbi[contractAddress][functionSignature].fullName;
  }

  public getFunctionInputs(contractAddress: string, functionSignature: string): object[] {
    if (this._isConvertedAbiFunctionEmpty(contractAddress, functionSignature)) return;
    return this._convertedFunctionAbi[contractAddress][functionSignature].inputs;
  }

  public getFunctionParameters(contractAddress: string, functionSignature: string, parameters: string): object {
    const functionInputs = this.getFunctionInputs(contractAddress, functionSignature);
    if (functionInputs === undefined) return;
    const decodeParameters = this._web3.eth.abi.decodeParameters(functionInputs, `0x${parameters}`);
    const resultInput = {};
    functionInputs.forEach(inputName => {
      resultInput[inputName['name']] = decodeParameters[inputName['name']];
    });
    return resultInput;
  }
}

export default new RayonArtifactAgent();
