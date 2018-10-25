// agent
import DbAgent from '../../common/agent/DbAgent';

// model
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import RegistryAgent from '../../registry/agent/RegistryAgent';

class RayonLogDbAgent {
  private TRANSFER_EVENT = 'Transfer(address,address,uint256)';

  // getter

  public async getNextBlockToRead() {
    let queryResult;
    queryResult = await DbAgent.executeAsync(`
      SELECT MAX(block_number) readLastBlock FROM event_log
    `);
    console.log(queryResult);
    queryResult = queryResult && queryResult.pop();

    return queryResult.readLastBlock === null ? RegistryAgent.getFirstContractAddress() : queryResult.readLastBlock + 1;
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
        INSERT INTO function_log (
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

    // console.log('storeResult', result);
  }

  private async _storeTxEventLogs(eventLog: EventLog) {
    if (eventLog.eventName === this.TRANSFER_EVENT) this._storeTxHolder(eventLog);
    const result = await DbAgent.executeAsync(
      `
        INSERT INTO event_log (
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

    // console.log('storeResult', result);
  }

  private async _storeTxHolder(eventLog: EventLog) {
    const inputData = JSON.parse(eventLog.inputData);
    const result = await DbAgent.executeAsync(
      `
      INSERT INTO holder_log (
        holder_log.from,
        holder_log.to,
        holder_log.amount,
        holder_log.called_time
      ) VALUES (
        ?,
        ?,
        ?,
        ?
      )`,
      [inputData.from, inputData.to, inputData.value, eventLog.calledTime]
    );
  }
}

export default new RayonLogDbAgent();
