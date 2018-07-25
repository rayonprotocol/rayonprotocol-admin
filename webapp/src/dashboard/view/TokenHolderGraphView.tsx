import React, { Component } from 'react';

// dc
import TransactionDC from 'transaction/dc/TransactionDC';

// model
import { Holder } from 'token/model/Token';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import DoughnutChart from 'common/view/chart/DoughnutChart';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './TokenHolderGraphView.scss';

interface TokenHolderGraphViewState {
  labels: string[];
  data: number[];
  holders: Holder[];
}

class TokenHolderGraphView extends Component<{}, TokenHolderGraphViewState> {
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
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: TransactionDC.getHolders(),
    };
  }

  onClickDetailButton() {
    console.log('click');
  }

  render() {
    const { holders } = this.state;
    const data = holders.map(item => item.percentage);
    const labels = holders.map(item => item.address);

    return (
      <DashboardContainer className={styles.tokenHolderGraphView} title={'Top 10 Holders'}>
        <p className={styles.subtitle}>Top 10 Holders</p>
        <DoughnutChart
          data={data}
          labels={labels}
          backgroundColor={this.backgroundColor}
          borderColor={this.backgroundColor}
          height={300}
        />
        <RayonButton
          className={styles.detailBtn}
          title={'detail'}
          onClickButton={this.onClickDetailButton.bind(this)}
        />
      </DashboardContainer>
    );
  }
}

export default TokenHolderGraphView;
