// agent
import DbAgent from '../../common/agent/DbAgent';
import ContractBlockchainAgent from '../../contract/agent/ContractBlockchainAgent';

// model
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

class RayonLogDbAgent {
  private TRANSFER_EVENT = 'Transfer(address,address,uint256)';

  // getter

  public async getNextBlockNumberToRead() {
    let queryResult;
    queryResult = await DbAgent.executeAsync(
      `
      SELECT
        MAX(block_number) readLastBlock
      FROM
        rayon.function_log where environment=?
    `,
      [process.env.ENV_BLOCKCHAIN]
    );
    queryResult = queryResult && queryResult.pop();
    return queryResult.readLastBlock === null
      ? ContractBlockchainAgent.getFirstContractBlockNumber()
      : queryResult.readLastBlock + 1;
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
          environment
        )
        VALUES (
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
        environment
      )
      VALUES (
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
      INSERT INTO rayon.holder_log (
        holder_log.from,
        holder_log.to,
        holder_log.amount,
        holder_log.called_time,
        holder_log.environment
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?
      )`,
      [inputData.from, inputData.to, inputData.value, eventLog.calledTime, process.env.ENV_BLOCKCHAIN]
    );
  }
}

export default new RayonLogDbAgent();
