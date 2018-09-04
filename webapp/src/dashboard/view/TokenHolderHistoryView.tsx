import React, { Component } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TokenHolderHistoryView.scss';

interface TokenHolderHistoryViewProps {
  userAddress: string;
}

class TokenHolderHistoryView extends Component<TokenHolderHistoryViewProps, {}> {
  render() {
    return (
      <DashboardContainer className={styles.tokenHolderView} title={`Token History ${this.props.userAddress}`}>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* {holdersList.map((address, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{address}</td>
                  <td>{this.props.holders[address]} RYN</td>
                  <td>{this.props.holders[address]} RYN</td>
                </tr>
              );
            })} */}
          </tbody>
        </table>
      </DashboardContainer>
    );
  }
}

export default TokenHolderHistoryView;
