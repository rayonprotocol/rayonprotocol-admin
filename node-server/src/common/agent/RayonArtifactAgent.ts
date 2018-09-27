import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

import ContractUtil from '../util/ContractUtil';

// model
import RayonArtifact, { artifactAbi } from '../../common/model/RayonArtifact';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

class RayonArtifactAgent {
  private static ABI_TYPE_FUNCTION = 'function';
  private static ABI_TYPE_EVENT = 'event';

  private _web3: Web3;

  private _contractAddress: string;
  private _contractArtifact: RayonArtifact;

  private _contractFunctionNames: object;
  private _contractEventNames: object;

  constructor(contractAddress: string) {
    this._contractAddress = contractAddress;
    this._contractArtifact = this._getContractArtifact();
    this._makeFunctionAndEventNameObject();
  }

  private _setWeb3() {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private _makeFunctionAndEventNameObject() {
    this._getAbiFromArtifact().forEach(abi => {
      abi.type === RayonArtifactAgent.ABI_TYPE_FUNCTION
        ? this._setFunctionFullNameByTopic(abi)
        : this._setEventFullNameByEventName(abi);
    });
  }

  private _setFunctionFullNameByTopic(abi: artifactAbi) {
    const topic = this._web3.eth.abi.encodeEventSignature(abi);
    const parameterTypes = abi.inputs.map(input => input.type).join(',');
    this._contractFunctionNames[topic] = `${abi.name}+(+${parameterTypes}+)`;
  }

  private _setEventFullNameByEventName(abi: artifactAbi) {
    const parameterTypes = abi.inputs.map(input => input.type).join(',');
    this._contractEventNames[abi.name] = `${abi.name}+(+${parameterTypes}+)`;
  }

  private _getContractArtifact() {
    const contractPath = `../../../../shared/build/${process.env.ENV_BLOCKCHAIN}/${this._contractAddress}.json`;
    return JSON.parse(fs.readFileSync(path.join(__dirname, contractPath), 'utf8'));
  }

  private _getAbiFromArtifact(): artifactAbi[] {
    return this._contractArtifact.abi;
  }

  private _getContractAddressFromArtifact() {
    return this._contractArtifact.networks[ContractConfigure.ROPSTEN_NETWORK_ID].address;
  }

  public getEventFullNameByEventName(eventName: string) {
    return this._contractEventNames[eventName];
  }

  public setFunctionFullNameByTopic(topic: string) {
    return this._contractFunctionNames[topic];
  }

  public getContractInstance(web3: Web3, contractAddress: string) {
    const contractArtifact = this._getContractArtifact();
    return new web3.eth.Contract(this._getAbiFromArtifact(), this._getContractAddressFromArtifact());
  }
}

export default RayonArtifactAgent;
