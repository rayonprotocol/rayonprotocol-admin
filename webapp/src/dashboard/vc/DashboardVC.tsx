import React, { Component } from 'react';

// model
import { UserTokenHistory } from '../../../../shared/token/model/Token';

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
  totalSupply: number;
  userTokenHistory: UserTokenHistory;
  selUserAccount: string;
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
    };
  }

  componentWillMount() {
    this.setDashboardState();
  }

  async setDashboardState() {
    const totalSupply = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchTop10TokenHolders();
    const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    this.setState({ ...this.state, totalSupply, holders, userTokenHistory });
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
