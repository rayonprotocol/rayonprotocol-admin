// agent
import DbAgent from '../../common/agent/DbAgent';

class ContractDbAgent {
  public async getMethodLogs() {
    return await DbAgent.executeAsync(
      `
        SELECT * FROM rayon.function_log;
      `
    );
  }
}

export default new ContractDbAgent();
