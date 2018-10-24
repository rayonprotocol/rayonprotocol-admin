// agent
import DbAgent from '../../common/agent/DbAgent';

class TokenDbAgent {
  public async getTokenHolders() {
    const result = await DbAgent.executeAsync(
      `select
        h.holder as address,
        sum(h.amount) as balance
        from
        (
          SELECT A.from as holder, (-1 * A.amount) as amount
          FROM rayon.holder_log as A
          union
          SELECT B.to as holder, B.amount as amount
          FROM rayon.holder_log as B
        ) as h
        group by h.holder
        order by sum(h.amount) DESC;
      `
    );
    return result;
  }

  public async getTokenHistory(userAddr: string) {
    const result = await DbAgent.executeAsync(
      `
      select
      *
      from
        (
          SELECT
            A.id,
            A.from,
            A.to,
            (-1 * A.amount) as amount,
            A.called_time as calledTime
          FROM rayon.holder_log as A where A.from = ?
          union
          SELECT *
          FROM rayon.holder_log as B where B.to = ?
        ) as h
      order by h.calledTime DESC
      `,
      [userAddr, userAddr]
    );
    return result;
  }
}

export default new TokenDbAgent();
