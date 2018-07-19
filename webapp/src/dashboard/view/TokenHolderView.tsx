import React, { Component } from 'react';

// dc
import TransactionDC from 'transaction/dc/TransactionDC';

// model
import { Holder } from 'transaction/model/Transaction';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderState {
  holders: Holder[];
}

class TokenHolderView extends Component<{}, TokenHolderState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: TransactionDC.getHolders(),
    };
  }
  render() {
    const { holders } = this.state;
    return (
      <DashboardContainer className={styles.tokenHolderView} title={'Token Holders'}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Quantity</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{item.address}</td>
                  <td>{item.quantity} RYN</td>
                  <td>{item.percentage}%</td>
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
