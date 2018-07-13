import React, { Component } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TotalTokenView.scss';

interface TotalTokenViewProps {
  className?: string;
}

class TotalTokenView extends Component<TotalTokenViewProps, {}> {
  render() {
    return (
      <DashboardContainer className={styles.totalTokenView} title={'Total Token'}>
        <p className={styles.subTitle}>Balance</p>
        <p className={styles.totalToken}>20,000,000 RYN</p>
      </DashboardContainer>
    );
  }
}

export default TotalTokenView;
