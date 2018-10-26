import React, { Component, Fragment } from 'react';

// model
import { Holder, TokenHistory } from '../../../../shared/token/model/Token';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Loading from 'common/view/loading/Loading';
import Container from 'common/view/container/Container';
import TokenOverviewView from 'token/view/TokenOverviewView';
import TokenHolderView from 'token/view/TokenHolderView';
import TokenHolderLogView from 'token/view/TokenHolderLogView';

interface TokenVCState {
  totalSupply: number;
  tokenCap: number;
  tokenHistory: TokenHistory[];
  holders: Holder[];
  selUserAddr: string;
  isLoading: boolean;
}

class TokenVC extends Component<{}, TokenVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: [],
      tokenHistory: [],
      totalSupply: 0,
      tokenCap: 0,
      selUserAddr: '',
      isLoading: true,
    };
  }

  async componentDidMount() {
    const holders = await TokenDC.fetchTokenHolders();
    const totalSupply: number = await TokenDC.fetchTokenTotalSupply();
    const tokenCap: number = await TokenDC.fetchTokenCap();

    this.setState({
      ...this.state,
      holders: holders.filter(holder => holder.address !== '0x0000000000000000000000000000000000000000'),
      totalSupply,
      tokenCap,
      isLoading: false,
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
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <TokenOverviewView totalSupply={this.state.totalSupply} tokenCap={this.state.tokenCap} />
            <TokenHolderView holders={this.state.holders} onClickHistory={this.onClickHistory.bind(this)} />
            <TokenHolderLogView selUserAddr={this.state.selUserAddr} tokenHistory={this.state.tokenHistory} />
          </Fragment>
        )}
      </Container>
    );
  }
}

export default TokenVC;
