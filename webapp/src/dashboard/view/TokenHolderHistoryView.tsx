import React, { Component, Fragment } from 'react';

// model
import { TokenHistory } from '../../../../shared/token/model/Token';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import SearchBar from 'common/view/input/SearchBar';
import TransferTokenCard from 'common/view/card/TransferTokenCard';

// util
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

// styles
import styles from './TokenHolderHistoryView.scss';

interface TokenHolderHistoryViewProps {
  tokenHistory: TokenHistory[];
  selUserAccount: string;
  onClickSearchButton: (target: string) => void;
}

class TokenHolderHistoryView extends Component<TokenHolderHistoryViewProps, {}> {
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

  renderTokenHistoryTable() {
    const latest10TokenHistory = this.getLatest10TokenHistory();
    return (
      <Fragment>
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
      </Fragment>
    );
  }

  renderTonkenCards() {
    const latest10TokenHistory = this.getLatest10TokenHistory();
    return latest10TokenHistory.map((history, index) => {
      return (
        <TransferTokenCard
          key={index}
          selUserAccount={this.props.selUserAccount}
          from={history.from}
          to={history.to}
          amount={history.amount}
          balance={history.balance}
        />
      );
    });
  }

  render() {
    return (
      <DashboardContainer className={styles.tokenHolderHistoryView}>
        <div className={styles.topTitleBar}>
          <p className={styles.title}>Token history</p>
          <SearchBar className={styles.searchBar} onClickSearchButton={this.props.onClickSearchButton} />
        </div>
        {!ArrayUtil.isEmpty(this.props.tokenHistory) && this.renderTonkenCards()}
        {/* <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          {!ArrayUtil.isEmpty(this.props.tokenHistory) && this.renderTokenHistoryTable()}
        </table> */}
        {ArrayUtil.isEmpty(this.props.tokenHistory) && this.renderNoTokenHistory()}
      </DashboardContainer>
    );
  }
}

export default TokenHolderHistoryView;
