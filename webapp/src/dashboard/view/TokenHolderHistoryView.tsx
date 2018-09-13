import React, { Component, Fragment } from 'react';

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
  selUserAccount: string;
}

class TokenHolderHistoryView extends Component<TokenHolderHistoryViewProps, {}> {
  trimAddress(addr: string) {
    return addr.slice(0, 5) + '...' + addr.slice(-5);
  }

  getLatest10TokenHistory(): TokenHistory[] {
    if (ArrayUtil.isEmpty(this.props.tokenHistory)) return [];
    return this.props.tokenHistory.length > 10 ? this.props.tokenHistory.slice(-10) : this.props.tokenHistory;
  }

  renderNoTokenHistory() {
    return (
      <div className={styles.noTokenHistory}>
        <p> No Token hisotry, yet</p>
      </div>
    );
  }

  isUserSender(history: TokenHistory) {
    return this.props.selUserAccount === history.from;
  }

  renderTokenHistoryTable() {
    const latest10TokenHistory = this.getLatest10TokenHistory();
    return (
      <Fragment>
        <tbody>
          {latest10TokenHistory.map((history, index) => {
            return (
              <tr key={index}>
                <td>{this.isUserSender(history) ? 'Send' : 'Recieve'}</td>
                <td>{this.trimAddress(this.isUserSender(history) ? history.to : history.from)}</td>
                <td>{history.amount} RYN</td>
                <td>{history.balance} RYN</td>
              </tr>
            );
          })}
        </tbody>
      </Fragment>
    );
  }

  render() {
    return (
      <DashboardContainer className={styles.tokenHolderHistoryView}>
        <div className={styles.topTitleBar}>
          <p className={styles.title}>Token history</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Detail</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          {!ArrayUtil.isEmpty(this.props.tokenHistory) && this.renderTokenHistoryTable()}
        </table>
        {ArrayUtil.isEmpty(this.props.tokenHistory) && this.renderNoTokenHistory()}
      </DashboardContainer>
    );
  }
}

export default TokenHolderHistoryView;
