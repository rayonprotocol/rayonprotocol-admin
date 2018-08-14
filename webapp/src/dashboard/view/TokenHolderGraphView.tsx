import React, { Component } from 'react';

// model
import { TransferEvent, RayonEvent } from '../../../../shared/token/model/Token';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import DoughnutChart from 'common/view/chart/DoughnutChart';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './TokenHolderGraphView.scss';

interface TokenHolderGraphViewState {
  labels: string[];
  data: number[];
  holders: object;
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
      holders: {},
    };
  }

  async componentWillMount() {
    TokenDC.addEventListener(RayonEvent.Transfer, this.getTransferEvent.bind(this));
    const holders = await TokenDC.fetchTop10TokenHolders();
    this.setState({ ...this.state, holders });
  }

  componentWillUnmount(): void {
    TokenDC.removeEventListener(RayonEvent.Transfer, this.getTransferEvent.bind(this));
  }

  async getTransferEvent(event: TransferEvent[]): Promise<void> {
    const holders = await TokenDC.fetchTop10TokenHolders();
    this.setState({ ...this.state, holders });
  }

  onClickDetailButton(): void {
    console.log('click');
  }

  render() {
    const { holders } = this.state;
    const holdersList = Object.keys(holders);
    const data = holdersList.map(address => holders[address]);

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
