import React, { Component } from 'react';

// model
import { Holder, TokenHistory } from '../../../../shared/token/model/Token';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Container from 'common/view/container/Container';
import TokenOverviewView from 'token/view/TokenOverviewView';
import TokenHolderView from 'token/view/TokenHolderView';
import TokenHolderLogView from 'token/view/TokenHolderLogView';

interface TokenVCState {
  isStateLoading: boolean;
  totalSupply: number;
  tokenCap: number;
  tokenHistory: TokenHistory[];
  holders: Holder[];
  selUserAddr: string;
}

class TokenVC extends Component<{}, TokenVCState> {
  private _ZERO_ACCOUNT = '0x0000000000000000000000000000000000000000';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: [],
      tokenHistory: [],
      totalSupply: 0,
      tokenCap: 0,
      selUserAddr: '',
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

  async onClickHistory(userAddr: string) {
    const tokenHistory: TokenHistory[] = await TokenDC.fetchTokenHistory(userAddr);
    this.setState({
      ...this.state,
      selUserAddr: userAddr,
      tokenHistory,
    });
  }

  render() {
    return (
      <Container>
        <TokenOverviewView totalSupply={this.state.totalSupply} tokenCap={this.state.tokenCap} />
        <TokenHolderView holders={this.state.holders} onClickHistory={this.onClickHistory.bind(this)} />
        <TokenHolderLogView selUserAddr={this.state.selUserAddr} tokenHistory={this.state.tokenHistory} />
      </Container>
    );
  }
}

export default TokenVC;
