// agent
import DbAgent from '../../common/agent/DbAgent';

// controller
import Web3Controller from '../../common/controller/Web3Controller';

// model
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';
import Contract, { ContractAbi, ABI_TYPE_FUNCTION, ABI_TYPE_EVENT } from '../../../../shared/contract/model/Contract';

class RayonLogDbAgent {
  // etc

  public async isRayonContract(contractAddress: string) {
    let queryResult;
    queryResult = await DbAgent.executeAsync(
      `
      SELECT count(*) cnt FROM rayon.contract WHERE address = ?
      `,
      [contractAddress]
    );
    queryResult = queryResult && queryResult.pop();
    return queryResult.cnt !== 0;
  }

  // getter

  public async getReadLastBlock() {
    const readLastBlockNumber = await DbAgent.executeAsync(`
      SELECT MAX(block_number) FROM rayon.event_log
    `);
    return readLastBlockNumber;
  }

  public async getFullName(contractAddress: string, signature: string, type: string) {
    let queryResult;
    queryResult = await DbAgent.executeAsync(
      `
        SELECT name FROM rayon.contract_abi WHERE contract_address=? AND signature=? AND type=?
      `,
      [contractAddress, signature, type]
    );
    queryResult = queryResult && queryResult.pop();
    return queryResult.name;
  }

  public async getInputs(contractAddress: string, signature: string, type: string) {
    let queryResult;
    queryResult = await DbAgent.executeAsync(
      `
        SELECT inputs FROM rayon.contract_abi WHERE contract_address=? AND signature=? AND type=?
      `,
      [contractAddress, signature, type]
    );
    queryResult = queryResult && queryResult.pop();
    return JSON.parse(queryResult.inputs);
  }

  public async getParameters(contractAddress: string, signature: string, parameters: string, type: string) {
    let queryResult;
    queryResult = await DbAgent.executeAsync(
      `
        SELECT inputs FROM rayon.contract_abi WHERE contract_address=? AND signature=? AND type=?
      `,
      [contractAddress, signature, type]
    );
    queryResult = queryResult && queryResult.pop();

    const inputs = JSON.parse(queryResult.inputs);
    if (inputs === undefined) return;
    const decodeParameters = Web3Controller.getWeb3().eth.abi.decodeParameters(inputs, `0x${parameters}`);
    const resultInput = {};
    inputs.forEach(inputName => {
      resultInput[inputName['name']] = decodeParameters[inputName['name']];
    });
    return resultInput;
  }

  // store

  public storeTxLogs(txLogs: TxLog[]) {
    txLogs.forEach(txLog => {
      this._storeTxFunctionLog(txLog.functionLog);
      txLog.eventLogs.forEach(eventLog => {
        this._storeTxEventLogs(eventLog);
      });
    });
  }

  private async _storeTxFunctionLog(functionLog: FunctionLog) {
    const result = await DbAgent.executeAsync(
      `
        INSERT INTO rayon.function_log (
            block_number,
            tx_hash,
            status,
            contract_address,
            function_name,
            input_data,
            called_time,
            url_etherscan,
            environment) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
        )`,
      [
        functionLog.blockNumber,
        functionLog.txHash.toLowerCase(),
        functionLog.status,
        functionLog.contractAddress.toLowerCase(),
        functionLog.functionName,
        functionLog.inputData,
        functionLog.calledTime,
        functionLog.urlEtherscan,
        functionLog.environment,
      ]
    );

    console.log('storeResult', result);
  }

  private async _storeTxEventLogs(eventLog: EventLog) {
    const result = await DbAgent.executeAsync(
      `
        INSERT INTO rayon.event_log (
            block_number,
            tx_hash,
            status,
            contract_address,
            event_name,
            function_name,
            input_data,
            called_time,
            url_etherscan,
            environment) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
        )`,
      [
        eventLog.blockNumber,
        eventLog.txHash.toLowerCase(),
        eventLog.status,
        eventLog.contractAddress.toLowerCase(),
        eventLog.eventName,
        eventLog.functionName,
        eventLog.inputData,
        eventLog.calledTime,
        eventLog.urlEtherscan,
        eventLog.environment,
      ]
    );

    console.log('storeResult', result);
  }

  public async storeContract(contract: Contract) {
    const result = await DbAgent.executeAsync(
      `
        INSERT INTO rayon.contract (
          address,
          name,
          owner
        ) VALUES (
          ?,
          ?,
          ?
        )
      `,
      [contract.address, contract.name, contract.owner]
    );
  }

  public async storeContractAbi(contractAbi: ContractAbi) {
    const result = await DbAgent.executeAsync(
      `
        INSERT INTO rayon.contract_abi (
          contract_address,
          inputs,
          name,
          type,
          signature
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `,
      [contractAbi.contractAddress, contractAbi.inputs, contractAbi.name, contractAbi.type, contractAbi.signature]
    );
  }
}

export default new RayonLogDbAgent();
