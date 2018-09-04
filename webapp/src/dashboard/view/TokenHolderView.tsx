import React, { Component } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderProps {
  onClickHolderAddress: (holderAddress: string) => void;
  holders: object;
}

class TokenHolderView extends Component<TokenHolderProps, {}> {
  render() {
    const holdersList = Object.keys(this.props.holders);
    return (
      <DashboardContainer className={styles.tokenHolderView} title={'Token Holders'}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {holdersList.map((address, index) => {
              return (
                <tr key={index} onClick={() => this.props.onClickHolderAddress(address)}>
                  <td>{index}</td>
                  <td>{address}</td>
                  <td>{this.props.holders[address]} RYN</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DashboardContainer>
    );
  }
}

export default TokenHolderView;
