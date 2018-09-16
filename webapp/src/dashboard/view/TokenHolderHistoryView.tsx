import React, { Component, Fragment } from 'react';

// model
import { TokenHistory } from '../../../../shared/token/model/Token';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import StringUtil from '../../../../shared/common/util/StringUtil';

// styles
import styles from './TokenHolderHistoryView.scss';

interface TokenHolderHistoryViewProps {
  tokenHistory: TokenHistory[];
  selHistoryAddress: string;
}

class TokenHolderHistoryView extends Component<TokenHolderHistoryViewProps, {}> {
  trimAddress(addr: string) {
    return addr.slice(0, 5) + '...' + addr.slice(-5);
  }

  getLatest10TokenHistory(): TokenHistory[] {
    if (ArrayUtil.isEmpty(this.props.tokenHistory)) return [];
    return this.props.tokenHistory.length > 5 ? this.props.tokenHistory.slice(-5) : this.props.tokenHistory;
  }

  isUserSender(history: TokenHistory) {
    return this.props.selHistoryAddress === history.from;
  }

  renderNoTokenHistory() {
    return (
      <div className={styles.noTokenHistory}>
        <p> No Token history, yet</p>
      </div>
    );
  }

  adjustBalanceForDemo(str: string) {
    if (str.indexOf('.') !== 0) {
      return str.slice(0, str.indexOf('.'));
    } else {
      return str;
    }
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
                <td>{StringUtil.removeLastZeroInFloatString(history.amount.toFixed(18))} RYN</td>
                {/* <td>{StringUtil.removeLastZeroInFloatString(history.balance.toFixed(18))} RYN</td> */}
                <td>{this.adjustBalanceForDemo(history.balance.toFixed(18))} RYN</td>
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
          {!StringUtil.isEmpty(this.props.selHistoryAddress) && (
            <div className={styles.selectedUserProfile}>
              <p>{this.props.selHistoryAddress}</p>
            </div>
          )}
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
