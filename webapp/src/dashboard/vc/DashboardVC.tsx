import React, { Component } from 'react';

// model
import { TransferEvent, MintEvent, RayonEvent } from '../../../../shared/token/model/Token';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Container from 'common/view/container/Container';
import TotalTokenView from 'dashboard/view/TotalTokenView';
import TokenHolderView from 'dashboard/view/TokenHolderView';
import TokenHolderGraphView from 'dashboard/view/TokenHolderGraphView';

// styles
import styles from './DashboardVC.scss';

interface DashboardVCState {
  holders: object;
  totalBalance: number;
}

class DashboardVC extends Component<{}, DashboardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: {},
      totalBalance: 0,
    };
    this.onTransferEvent = this.onTransferEvent.bind(this);
    this.onMintEvent = this.onMintEvent.bind(this);
  }

  async componentWillMount() {
    TokenDC.addEventListener(RayonEvent.Transfer, this.onTransferEvent);
    TokenDC.addEventListener(RayonEvent.Mint, this.onMintEvent);
    const totalBalance = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchTop10TokenHolders();
    this.setState({ ...this.state, totalBalance, holders });
  }

  componentWillUnmount(): void {
    TokenDC.removeEventListener(RayonEvent.Transfer, this.onTransferEvent);
    TokenDC.removeEventListener(RayonEvent.Mint, this.onMintEvent);
  }

  async onTransferEvent(event: TransferEvent[]): Promise<void> {
    const holders = await TokenDC.fetchTop10TokenHolders();
    this.setState({ ...this.state, holders });
  }

  async onMintEvent(event: MintEvent[]): Promise<void> {
    const totalBalance = await TokenDC.fetchTokenTotalBalance();
    this.setState({ ...this.state, totalBalance });
  }

  onClickHolderDetailButton() {
    console.log('click');
  }

  render() {
    return (
      <div className={styles.dashboard}>
        <Container>
          <TotalTokenView totalBalance={this.state.totalBalance} />
          <TokenHolderView holders={this.state.holders} />
          <TokenHolderGraphView holders={this.state.holders} />
        </Container>
      </div>
    );
  }
}

export default DashboardVC;
