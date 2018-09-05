import React, { Component } from 'react';

// model
import { TransferEvent, MintEvent, RayonEvent, UserTokenHistory } from '../../../../shared/token/model/Token';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Container from 'common/view/container/Container';
import TotalSupplyView from 'dashboard/view/TotalSupplyView';
import TokenHolderView from 'dashboard/view/TokenHolderView';
import TokenHolderHistoryView from 'dashboard/view/TokenHolderHistoryView';
import TokenHolderGraphView from 'dashboard/view/TokenHolderGraphView';

// styles
import styles from './DashboardVC.scss';

interface DashboardVCState {
  holders: object;
  totalBalance: number;
  userTokenHistory: UserTokenHistory;
  selUserAccount: string;
}

class DashboardVC extends Component<{}, DashboardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: {},
      totalBalance: 0,
      userTokenHistory: {},
      selUserAccount: '',
    };
    this.onTransferEvent = this.onTransferEvent.bind(this);
    this.onMintEvent = this.onMintEvent.bind(this);
  }

  componentWillMount() {
    TokenDC.addEventListener(RayonEvent.Transfer, this.onTransferEvent);
    TokenDC.addEventListener(RayonEvent.Mint, this.onMintEvent);
    this.setDashboardState();
  }

  componentWillUnmount(): void {
    TokenDC.removeEventListener(RayonEvent.Transfer, this.onTransferEvent);
    TokenDC.removeEventListener(RayonEvent.Mint, this.onMintEvent);
  }

  onTransferEvent(event: TransferEvent[]): void {
    this.setDashboardState();
  }

  onMintEvent(event: MintEvent[]): void {
    this.setDashboardState();
  }

  async setDashboardState() {
    const totalBalance = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchTop10TokenHolders();
    const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    this.setState({ ...this.state, totalBalance, holders, userTokenHistory });
  }

  onClickHolderAddress(holderAddress: string) {
    this.setState({ ...this.state, selUserAccount: holderAddress });
  }

  onClickHolderDetailButton() {
    console.log('click');
  }

  render() {
    return (
      <div className={styles.dashboard}>
        <Container>
          <TotalSupplyView totalBalance={this.state.totalBalance} />
          <TokenHolderGraphView holders={this.state.holders} />
          <TokenHolderView holders={this.state.holders} onClickHolderAddress={this.onClickHolderAddress.bind(this)} />
          <TokenHolderHistoryView tokenHistory={this.state.userTokenHistory[this.state.selUserAccount]} />
        </Container>
      </div>
    );
  }
}

export default DashboardVC;
