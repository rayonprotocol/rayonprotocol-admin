import React, { Component } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import DoughnutChart from 'common/view/chart/DoughnutChart';

// styles
import styles from './TokenHolderGraphView.scss';

interface TokenHolderGraphViewProps {
  holders: object;
}

interface TokenHolderGraphViewState {
  labels: string[];
  data: number[];
}

class TokenHolderGraphView extends Component<TokenHolderGraphViewProps, TokenHolderGraphViewState> {
  backgroundColor = [
    'rgba(119, 151, 255,0.7)',
    'rgba(109,170,232,0.7)',
    'rgba(132,215,255,0.7)',
    'rgba(119,255,213,0.7)',
    'rgba(109,132,229,0.7)',
    'rgba(207,153,255,0.7)',
    'rgba(174,159,232,0.7)',
    'rgba(188,195,255,0.7)',
    'rgba(159,190,232,0.7)',
    'rgba(175,234,255,0.7)',
  ];

  render() {
    const holdersList = Object.keys(this.props.holders);
    const data = holdersList.map(address => this.props.holders[address]);

    return (
      <DashboardContainer className={styles.tokenHolderGraphView} title={'Top 10 Holders'}>
        <p className={styles.subtitle}>Top 10 Holders</p>
        <DoughnutChart
          data={data}
          labels={holdersList}
          backgroundColor={this.backgroundColor}
          borderColor={this.backgroundColor}
          height={300}
        />
      </DashboardContainer>
    );
  }
}

export default TokenHolderGraphView;
