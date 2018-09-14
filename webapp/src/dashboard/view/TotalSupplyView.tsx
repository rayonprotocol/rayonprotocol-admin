import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TotalSupplyView.scss';

interface TotalSupplyViewProps {
  totalSupply: BigNumber;
}

class TotalSupplyView extends Component<TotalSupplyViewProps, {}> {
  render() {
    return (
      <DashboardContainer className={styles.totalTokenView}>
        <div className={styles.totalTokenSection}>
          <p className={styles.subTitle}>Total Supply</p>
          <p className={styles.totalToken}>
            <span>{parseInt(this.props.totalSupply.toFixed(18), 10)}</span>
            RYN
          </p>
        </div>
      </DashboardContainer>
    );
  }
}

export default TotalSupplyView;
