import React, { Component } from 'react';
import AnimatedNumber from 'react-animated-number';

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
          <p className={styles.totalToken}>
            <AnimatedNumber
              component={'text'}
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

export default TotalTokenView;
