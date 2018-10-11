// agent
import DbAgent from '../../common/agent/DbAgent';

class ContractDbAgent {
  public async getMethodLogs() {
    return await DbAgent.executeAsync(
      `
        SELECT * FROM rayon.function_log ORDER BY block_number;
      `
    );
  }

  public async getEventLogs() {
    return await DbAgent.executeAsync(
      `
        SELECT * FROM rayon.event_log ORDER BY block_number;
      `
    );
  }
}

export default new ContractDbAgent();
