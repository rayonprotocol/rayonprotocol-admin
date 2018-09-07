import React, { Component } from 'react';

// model
import { UserTokenHistory } from '../../../../shared/token/model/Token';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Container from 'common/view/container/Container';
import TotalSupplyView from 'dashboard/view/TotalSupplyView';
import TokenHolderView from 'dashboard/view/TokenHolderView';
import TokenHolderHistoryView from 'dashboard/view/TokenHolderHistoryView';
import TokenHolderGraphView from 'dashboard/view/TokenHolderGraphView';
import TopDashboardStatusView from 'dashboard/view/TopDashboardStatusView';

// styles
import styles from './DashboardVC.scss';

interface DashboardVCState {
  holders: object;
  totalSupply: number;
  userTokenHistory: UserTokenHistory;
  selUserAccount: string;
  intervalTimerId: number;
  isStateLoading: boolean;
}

class DashboardVC extends Component<{}, DashboardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: {},
      totalSupply: 0,
      userTokenHistory: {},
      selUserAccount: '',
      intervalTimerId: setInterval(
        this.setLoadingAndfetchDashboadState.bind(this),
        ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL
      ),
      isStateLoading: true,
    };
  }

  componentWillMount() {
    this.setLoadingAndfetchDashboadState();
  }

  setLoadingAndfetchDashboadState() {
    this.setState({ ...this.state, isStateLoading: true }, this.fetchDashboardStates.bind(this));
  }

  async fetchDashboardStates() {
    const totalSupply = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchDashboardTokenHolders();
    const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    this.setState({ ...this.state, totalSupply, holders, userTokenHistory, isStateLoading: false });
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
          <TopDashboardStatusView isLoading={this.state.isStateLoading} />
          <TotalSupplyView totalSupply={this.state.totalSupply} />
          <TokenHolderGraphView holders={this.state.holders} />
          <TokenHolderView holders={this.state.holders} onClickHolderAddress={this.onClickHolderAddress.bind(this)} />
          <TokenHolderHistoryView tokenHistory={this.state.userTokenHistory[this.state.selUserAccount]} />
        </Container>
      </div>
    );
  }
}

export default DashboardVC;
