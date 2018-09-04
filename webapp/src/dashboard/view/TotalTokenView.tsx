import React, { Component } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TotalTokenView.scss';

interface TotalTokenViewProps {
  totalBalance: number;
}

class TotalTokenView extends Component<TotalTokenViewProps, {}> {
  render() {
    return (
      <DashboardContainer className={styles.totalTokenView} title={'Total Token'}>
        <div className={styles.totalTokenSection}>
          <p className={styles.subTitle}>Balance</p>
          <p className={styles.totalToken}>{this.props.totalBalance} RYN</p>
        </div>
      </DashboardContainer>
    );
  }
}

export default TotalTokenView;
