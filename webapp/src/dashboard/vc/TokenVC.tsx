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

// util
import NumberUtil from '../../../../shared/common/util/NumberUtil';

// styles
import styles from './TokenVC.scss';

interface DashboardVCState {
  holders: object;
  totalSupply: BigNumber;
  userTokenHistory: UserTokenHistory;
  selUserAccount: string;
  intervalTimerId: number;
  isStateLoading: boolean;
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
    const totalSupply: BigNumber = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchDashboardTokenHolders();
    const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    const tokenCap: BigNumber = await TokenDC.fetchTokenCap();
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
          <TotalSupplyView totalSupply={NumberUtil.RoundNumberWithPrecision(this.state.totalSupply.toNumber(), 2)} />
          <TokenInfoView
            tokenCap={NumberUtil.RoundNumberWithPrecision(this.state.tokenCap.toNumber(), 2)}
            percentage={(this.state.totalSupply.toNumber() / this.state.tokenCap.toNumber()) * 100}
          />
          <TokenHolderView
            holders={this.state.holders}
            onClickHolderAddress={this.onClickHolderAddress.bind(this)}
            onClickSearchButton={this.onClickSearchButton.bind(this)}
          />
          <TokenHolderHistoryView
            selUserAccount={this.state.selUserAccount}
            tokenHistory={this.state.userTokenHistory[this.state.selUserAccount]}
          />
        </Container>
      </div>
    );
  }
}

export default TokenVC;
