// agent
import DbAgent from '../../common/agent/DbAgent';

class ContractDbAgent {
  public async getMethodLogs() {
    return await DbAgent.executeAsync(
      `
        SELECT
          block_number as blockNumber,
          tx_hash as txHash,
          contract_address as contractAddress,
          function_name as functionName,
          input_data as inputData,
          called_time as calledTime,
          url_etherscan as urlEtherscan
        FROM rayon.function_log ORDER BY block_number;
      `
    );
  }

  public async getEventLogs() {
    return await DbAgent.executeAsync(
      `
        SELECT
          block_number as blockNumber,
          tx_hash as txHash,
          contract_address as contractAddress,
          event_name as eventName,
          function_name as functionName,
          input_data as inputData,
          called_time as calledTime,
          url_etherscan as urlEtherscan
        FROM rayon.event_log ORDER BY block_number;
      `
    );
  }
}

export default new ContractDbAgent();
