import React, { Component } from 'react';
import AnimatedNumber from 'react-animated-number';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TotalSupplyView.scss';

interface TotalSupplyViewProps {
  totalBalance: number;
}

class TotalSupplyView extends Component<TotalSupplyViewProps, {}> {
  render() {
    return (
      <DashboardContainer className={styles.totalTokenView} title={'Total Supply'}>
        <div className={styles.totalTokenSection}>
          <p className={styles.subTitle}>Total Supply</p>
          <p className={styles.totalToken}>
            <AnimatedNumber
              component={'span'}
              value={this.props.totalBalance}
              style={{
                transition: '0.8s ease-out',
                fontSize: 48,
                transitionProperty: 'background-color, color, opacity',
                marginRight: '10px',
              }}
              duration={600}
              stepPrecision={1}
              formatValue={num => Math.ceil(num)}
            />
            RYN
          </p>
        </div>
      </DashboardContainer>
    );
  }
}

export default TotalSupplyView;
