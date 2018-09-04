import React, { Component } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderProps {
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
              {/* <th>Percentage</th> */}
            </tr>
          </thead>
          <tbody>
            {holdersList.map((address, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{address}</td>
                  <td>{this.props.holders[address]} RYN</td>
                  {/* <td>{item.percentage}%</td> */}
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
