import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';

// agent
import DbAgent from '../../common/agent/DbAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// model
import Contract, { AbiElement, ConvertedAbi } from '../../../../shared/contract/model/Contract';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

class RayonArtifactAgent {
  private _contract: Contract = new Contract();
  private _convertedAbi: ConvertedAbi = {};

  public startArtifactConvert(): void {
    this._contract.getContractAddressList().forEach(contractAddress => {
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
    const isNotFunctionOrEvent = !(
      abiElement.type === Contract.ABI_TYPE_EVENT || abiElement.type === Contract.ABI_TYPE_FUNCTION
    );
    const isFallbackEvent = abiElement.type === Contract.ABI_TYPE_EVENT && abiElement.name === undefined;
    if (isFallbackEvent || isNotFunctionOrEvent) return; // skip fallBack

    const parameterTypes = ArrayUtil.isEmpty(abiElement.inputs)
      ? ''
      : abiElement.inputs.map(input => input.type).join(',');

    const signature =
      abiElement.type === Contract.ABI_TYPE_EVENT
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

  // verify function

  public isRayonContract(contractAddress: string): boolean {
    if (contractAddress === null) return;
    return this._contract.getContractAddressList().indexOf(contractAddress.toLowerCase()) > -1;
  }

  public isAbiDataExist(address: string, signature: string): boolean {
    return !(this._convertedAbi[address] === undefined || this._convertedAbi[address][signature] === undefined);
  }

  // getter

  public getContractOverview(contractAddress: string) {
    return this._contract.getAllContractOverview();
  }

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
