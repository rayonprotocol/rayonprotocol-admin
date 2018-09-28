import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

import ContractUtil from '../util/ContractUtil';

// model
import RayonArtifact, { artifactAbi, ConvertedAbiFunctions } from '../../common/model/RayonArtifact';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

class RayonArtifactAgent {
  private static ABI_TYPE_FUNCTION = 'function';
  private static ABI_TYPE_EVENT = 'event';

  private _web3: Web3;

  private _contracts: Map<string, Set<RayonEvent>>; // key: address value: watched event

  private _contractEventNames: object = {};
  private _convertedAbiFunction: ConvertedAbiFunctions = {};

  constructor(contracts: Map<string, Set<RayonEvent>>) {
    this._contracts = contracts;
    this._initialize();
  }

  private _initialize() {
    this._setWeb3();
    this._contracts.forEach(this._classifyAndConvertAbi.bind(this));
  }

  private _setWeb3(): void {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private _classifyAndConvertAbi(contractEvents: Set<RayonEvent>, contractAddress: string): void {
    const artifact = this._getContractArtifact(contractAddress);
    this._getAbiFromArtifact(artifact).forEach(abi => {
      abi.type === RayonArtifactAgent.ABI_TYPE_FUNCTION
        ? this._generateConvertedAbiFunction(abi)
        : this._generateConvertedAbiEvent(abi);
    });
  }

  private _generateConvertedAbiFunction(abi: artifactAbi): void {
    const parameterTypes = ArrayUtil.isEmpty(abi.inputs) ? '' : abi.inputs.map(input => input.type).join(',');
    this._convertedAbiFunction[abi.name.toLowerCase()] = {
      fullNames: `${abi.name}(${parameterTypes})`,
      inputs: abi.inputs,
    };
  }

  private _generateConvertedAbiEvent(abi: artifactAbi): void {
    if (abi.name === undefined) return; // fallBack
    const parameterTypes = ArrayUtil.isEmpty(abi.inputs) ? '' : abi.inputs.map(input => input.type).join(',');
    this._contractEventNames[abi.name] = `${abi.name}(${parameterTypes})`;
  }

  private _getContractArtifact(contractAddress: string) {
    const contractPath = `../../../../shared/build/${process.env.ENV_BLOCKCHAIN}/${contractAddress}.json`;
    return JSON.parse(fs.readFileSync(path.join(__dirname, contractPath), 'utf8'));
  }

  private _getAbiFromArtifact(contractArtifact: RayonArtifact): artifactAbi[] {
    return contractArtifact.abi;
  }

  public getContractInstance(contractAddress: string) {
    const contractArtifact = this._getContractArtifact(contractAddress);
    return this._web3.eth.Contract(this._getAbiFromArtifact(contractArtifact), contractAddress);
  }

  public getEventFullNameByEventName(eventName: string): string {
    return this._contractEventNames[eventName];
  }

  public getFunctionFullName(functionName: string): string {
    return this._convertedAbiFunction[functionName].fullNames;
  }

  public getFunctionInputs(functionName: string): object {
    return this._convertedAbiFunction[functionName].inputs;
  }

  public getFunctionParameters(functionName: string, parameters: string[]): object {
    console.log(functionName);
    return this._web3.eth.abi.decodeParameters(this._convertedAbiFunction[functionName].inputs, ...parameters);
  }
}

export default RayonArtifactAgent;
