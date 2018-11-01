// agent
import DbAgent from '../../common/agent/DbAgent';

class TokenDbAgent {
  public async getTokenHolders() {
    return await DbAgent.executeAsync(
      `
      SELECT
        h.holder AS address,
        sum(h.amount) AS balance
      FROM
      (
        (
          SELECT
            A.from as holder,
            sum(-1 * A.amount ) AS amount
          FROM
            rayon.holder_log AS A
          WHERE A.environment = ?
          GROUP BY A.from
        )
        UNION
        (
          SELECT
            B.to AS holder,
            sum(B.amount) AS amount
          FROM
            rayon.holder_log as B
          WHERE B.environment = ?
          GROUP BY B.to
        )
      ) AS h
      GROUP BY h.holder
      ORDER BY sum(h.amount) DESC;
      `,
      [process.env.ENV_BLOCKCHAIN, process.env.ENV_BLOCKCHAIN]
    );
  }

  public async getTokenHistory(userAddr: string) {
    return await DbAgent.executeAsync(
      `
      SELECT
      *
      FROM
        (
          (
            SELECT
              A.id,
              A.from,
              A.to,
              (-1 * A.amount) AS amount,
              A.called_time AS calledTime,
              A.environment
            FROM rayon.holder_log AS A
            WHERE A.from = ? AND A.environment = ?
          )
          UNION
          (
            SELECT *
            FROM rayon.holder_log as B
            WHERE B.to = ? AND B.environment = ?
          )
        ) AS h
      ORDER BY h.calledTime DESC
      `,
      [userAddr, process.env.ENV_BLOCKCHAIN, userAddr, process.env.ENV_BLOCKCHAIN]
    );
  }
}

export default new TokenDbAgent();
