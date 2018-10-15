// agent
import DbAgent from '../../common/agent/DbAgent';

// model
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

class RayonLogStoreAgent {
  public async getLatestBlock() {
    const readLastBlockNumber = await DbAgent.executeAsync(`
      SELECT MAX(block_number) FROM \`rayon\`.\`event_log\`
    `);
    return readLastBlockNumber;
  }

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
            url_etherscan) VALUES (
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
            url_etherscan) VALUES (
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
      ]
    );

    console.log('storeResult', result);
  }
}

export default new RayonLogStoreAgent();
