import React, { Component } from 'react';

// model
import { UserTokenHistory } from '../../../../shared/token/model/Token';
import { Holder } from '../../../../shared/token/model/Token';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Container from 'common/view/container/Container';
import TokenOverviewView from 'token/view/TokenOverviewView';
import TokenHolderView from 'token/view/TokenHolderView';

interface TokenVCState {
  isStateLoading: boolean;
  totalSupply: number;
  tokenCap: number;
  userTokenHistory: UserTokenHistory;
  holders: Holder[];
}

class TokenVC extends Component<{}, TokenVCState> {
  private _ZERO_ACCOUNT = '0x0000000000000000000000000000000000000000';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: [],
      totalSupply: 0,
      tokenCap: 0,
    };
  }

  componentDidMount() {
    this._setLoadingAndfetchDashboadState();
  }

  private _setLoadingAndfetchDashboadState() {
    this.setState({ ...this.state, isStateLoading: true }, this.fetchDashboardStates.bind(this));
  }

  private async fetchDashboardStates() {
    const holders = await TokenDC.fetchTokenHolders();
    const totalSupply: number = await TokenDC.fetchTokenTotalBalance();
    const tokenCap: number = await TokenDC.fetchTokenCap();

    this.setState({
      ...this.state,
      holders,
      totalSupply,
      tokenCap,
      isStateLoading: false,
    });
  }

  async onClickHistory() {
    console.log('good!');
    // const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    // this.setState({
    //   userTokenHistory,
    // });
  }

  render() {
    return (
      <Container>
        <TokenOverviewView totalSupply={this.state.totalSupply} tokenCap={this.state.tokenCap} />
        <TokenHolderView holders={this.state.holders} onClickHistory={this.onClickHistory.bind(this)} />
      </Container>
    );
  }
}

export default TokenVC;
