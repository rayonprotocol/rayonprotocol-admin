import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';

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
  //   totalSupply: BigNumber;
  //   tokenCap: BigNumber;
  //   userTokenHistory: UserTokenHistory;
  holders: Holder[];
}

class TokenVC extends Component<{}, TokenVCState> {
  private _ZERO_ACCOUNT = '0x0000000000000000000000000000000000000000';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: [],
    };
  }

  componentDidMount() {
    this._setLoadingAndfetchDashboadState();
  }

  private _setLoadingAndfetchDashboadState() {
    this.setState({ ...this.state, isStateLoading: true }, this.fetchDashboardStates.bind(this));
  }

  private async fetchDashboardStates() {
    // const totalSupply: BigNumber = await TokenDC.fetchTokenTotalBalance();
    const holders = await TokenDC.fetchTokenHolders();
    // const userTokenHistory: UserTokenHistory = await TokenDC.fetchTokenHistory();
    // const tokenCap: BigNumber = await TokenDC.fetchTokenCap();

    delete holders['0x0000000000000000000000000000000000000000'];

    this.setState({
      ...this.state,
      //   totalSupply,
      //   tokenCap,
      holders,
      //   userTokenHistory,
      isStateLoading: false,
    });
  }

  render() {
    return (
      <Container>
        <TokenOverviewView />
        <TokenHolderView holders={this.state.holders} />
      </Container>
    );
  }
}

export default TokenVC;
