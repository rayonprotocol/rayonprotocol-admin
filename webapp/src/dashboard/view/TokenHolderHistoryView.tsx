import React, { Component } from 'react';

// model
import { TokenHistory } from '../../../../shared/token/model/Token';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

// styles
import styles from './TokenHolderHistoryView.scss';

interface TokenHolderHistoryViewProps {
  tokenHistory: TokenHistory[];
}

class TokenHolderHistoryView extends Component<TokenHolderHistoryViewProps, {}> {
  getLatest10TokenHistory(): TokenHistory[] {
    if (ArrayUtil.isEmpty(this.props.tokenHistory)) return [];
    return this.props.tokenHistory.length > 10 ? this.props.tokenHistory.slice(-10) : this.props.tokenHistory;
  }

  render() {
    const latest10TokenHistory = this.getLatest10TokenHistory();

    return (
      <DashboardContainer className={styles.tokenHolderHistoryView} title={`Token History`}>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {latest10TokenHistory.map((history, index) => {
              return (
                <tr key={index}>
                  <td>{history.from}</td>
                  <td>{history.to}</td>
                  <td>{history.amount} RYN</td>
                  <td>{history.balance} RYN</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DashboardContainer>
    );
  }
}

export default TokenHolderHistoryView;
