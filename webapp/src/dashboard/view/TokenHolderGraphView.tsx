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
    'rgba(240, 102, 111,0.7)',
    'rgba(234,248,191,0.7)',
    'rgba(170,189,140,0.7)',
    'rgba(233,227,180,0.7)',
    'rgba(243,155,109,0.7)',
    'rgba(251,97,7,0.7)',
    'rgba(243,222,44,0.7)',
    'rgba(124,181,24,0.7)',
    'rgba(92,128,1,0.7)',
    'rgba(251,176,45,0.7)',
  ];

  onClickDetailButton(): void {
    console.log('click');
  }

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
