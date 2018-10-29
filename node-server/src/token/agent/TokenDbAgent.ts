// agent
import DbAgent from '../../common/agent/DbAgent';

class TokenDbAgent {
  public async getTokenHolders() {
    return await DbAgent.executeAsync(
      `
      select
        h.holder as address,
        sum(h.amount) as balance
        from
        (
          SELECT A.from as holder, sum(-1 * A.amount ) as amount
          FROM rayon.holder_log as A
          group by A.from
          union
          SELECT B.to as holder, sum(B.amount) as amount
          FROM rayon.holder_log as B
          group by B.to
        ) as h
        group by h.holder
        order by sum(h.amount) DESC;
      `
    );
  }

  public async getTokenHistory(userAddr: string) {
    return await DbAgent.executeAsync(
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
  }
}

export default new TokenDbAgent();
