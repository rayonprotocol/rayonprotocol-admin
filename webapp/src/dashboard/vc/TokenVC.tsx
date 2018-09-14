import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';

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
import styles from './TokenVC.scss';

interface DashboardVCState {
  holders: object;
  userTokenHistory: UserTokenHistory;
  selHolderAddress: string;
  selHistoryAddress: string;
  intervalTimerId: number;
  isStateLoading: boolean;
  totalSupply: BigNumber;
  tokenCap: BigNumber;
}

class TokenVC extends Component<{}, DashboardVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: {},
      totalSupply: new BigNumber(0),
      tokenCap: new BigNumber(0),
      userTokenHistory: {},
      selHolderAddress: '',
      selHistoryAddress: '',
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
    const totalSupply: BigNumber = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchDashboardTokenHolders();
    const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    const tokenCap: BigNumber = await TokenDC.fetchTokenCap();
    this.setState({
      ...this.state,
      totalSupply,
      tokenCap,
      holders,
      userTokenHistory,
      isStateLoading: false,
    });
  }

  onClickDetailButton(holderAddress: string) {
    this.setState({ ...this.state, selHistoryAddress: holderAddress });
  }

  onClickHolderSearchButton(userName: string) {
    const selHolderAddress = this.state.userTokenHistory[userName] !== undefined ? userName : '';
    this.setState({ ...this.state, selHolderAddress });
  }

  render() {
    return (
      <div className={styles.dashboard}>
        <Container>
          <TopDashboardStatusView isLoading={this.state.isStateLoading} />
          <TotalSupplyView totalSupply={this.state.totalSupply} />
          <TokenInfoView
            tokenCap={this.state.tokenCap}
            percentage={(this.state.totalSupply.toNumber() / this.state.tokenCap.toNumber()) * 100}
          />
          <TokenHolderView
            holders={this.state.holders}
            selHolderAddress={this.state.selHolderAddress}
            onClickDetailButton={this.onClickDetailButton.bind(this)}
            onClickSearchButton={this.onClickHolderSearchButton.bind(this)}
          />
          <TokenHolderHistoryView
            selHistoryAddress={this.state.selHistoryAddress}
            tokenHistory={this.state.userTokenHistory[this.state.selHistoryAddress]}
          />
        </Container>
      </div>
    );
  }
}

export default TokenVC;
