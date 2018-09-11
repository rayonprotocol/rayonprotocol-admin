import React, { Component } from 'react';

// model
import { UserTokenHistory } from '../../../../shared/token/model/Token';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Container from 'common/view/container/Container';
import TokenInfoView from 'dashboard/view/TokenInfoView';
import TotalSupplyView from 'dashboard/view/TotalSupplyView';
import TokenHolderView from 'dashboard/view/TokenHolderView';
import TokenHolderHistoryView from 'dashboard/view/TokenHolderHistoryView';
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
  tokenCap: number;
}

class DashboardVC extends Component<{}, DashboardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: {},
      totalSupply: 0,
      tokenCap: 0,
      userTokenHistory: {},
      selUserAccount: '',
      intervalTimerId: setInterval(
        this.setLoadingAndfetchDashboadState.bind(this),
        ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL
      ),
      isStateLoading: true,
    };
  }

  componentDidMount() {
    this.setLoadingAndfetchDashboadState();
  }

  setLoadingAndfetchDashboadState() {
    this.setState({ ...this.state, isStateLoading: true }, this.fetchDashboardStates.bind(this));
  }

  async fetchDashboardStates() {
    const totalSupply = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchDashboardTokenHolders();
    const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    const tokenCap = await TokenDC.fetchTokenCap();
    this.setState({ ...this.state, totalSupply, holders, userTokenHistory, tokenCap, isStateLoading: false });
  }

  onClickHolderAddress(holderAddress: string) {
    this.setState({ ...this.state, selUserAccount: holderAddress });
  }

  onClickSearchButton(userName: string) {
    const selUserAccount = this.state.userTokenHistory[userName] !== undefined ? userName : '';
    this.setState({ ...this.state, selUserAccount });
  }

  render() {
    return (
      <div className={styles.dashboard}>
        <Container>
          <TopDashboardStatusView isLoading={this.state.isStateLoading} />
          <TotalSupplyView totalSupply={this.state.totalSupply} />
          <TokenInfoView
            tokenCap={this.state.tokenCap}
            // percentage={(this.state.totalSupply / this.state.tokenCap) * 100}
            percentage={13}
          />
          <TokenHolderView holders={this.state.holders} onClickHolderAddress={this.onClickHolderAddress.bind(this)} />
          <TokenHolderHistoryView
            selUserAccount={this.state.selUserAccount}
            tokenHistory={this.state.userTokenHistory[this.state.selUserAccount]}
            onClickSearchButton={this.onClickSearchButton.bind(this)}
          />
        </Container>
      </div>
    );
  }
}

export default DashboardVC;
