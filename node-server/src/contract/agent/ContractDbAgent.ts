// agent
import DbAgent from '../../common/agent/DbAgent';
import { ABI_TYPE_EVENT, ABI_TYPE_FUNCTION } from '../../../../shared/contract/model/Contract';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';

class ContractDbAgent {
  private _base = `
  SELECT
    block_number as blockNumber,
    tx_hash as txHash,
    status as status,
    contract_address as contractAddress,
    function_name as functionName,
    input_data as inputData,
    called_time as calledTime,
    url_etherscan as urlEtherscan,
    environment as environment`;

  public async getLastRecord(type: string) {
    const query =
      type !== ABI_TYPE_EVENT
        ? `SELECT * FROM rayon.function_log ORDER BY block_number DESC`
        : `SELECT * FROM rayon.event_log ORDER BY block_number DESC`;
    return await DbAgent.executeAsync(query);
  }

  public async getAllContractLogs(type: string) {
    if (StringUtil.isEmpty(type) || !(type === ABI_TYPE_EVENT || type === ABI_TYPE_FUNCTION)) return null;
    const query =
      type === ABI_TYPE_EVENT
        ? `${this._base}, event_name as eventName FROM rayon.event_log where environment = ? ORDER BY block_number`
        : `${this._base} FROM rayon.function_log where environment = ? ORDER BY block_number `;
    return await DbAgent.executeAsync(query, [process.env.ENV_BLOCKCHAIN]);
  }

  public async getContractLogs(contractAddress: string, type: string) {
    if (StringUtil.isEmpty(contractAddress) || StringUtil.isEmpty(type)) return null;
    else if (!(type === ABI_TYPE_EVENT || type === ABI_TYPE_FUNCTION)) return null;
    const query =
      type === ABI_TYPE_EVENT
        ? this._base +
          `, event_name as eventName FROM rayon.event_log WHERE contract_address=? AND environment = ? ORDER BY block_number`
        : this._base + ` FROM rayon.function_log WHERE contract_address=? AND environment = ? ORDER BY block_number `;
    return await DbAgent.executeAsync(query, [contractAddress, process.env.ENV_BLOCKCHAIN]);
  }
}

export default new ContractDbAgent();
