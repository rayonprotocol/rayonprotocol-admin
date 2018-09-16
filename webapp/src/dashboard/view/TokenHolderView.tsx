import React, { Component, Fragment } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import DoughnutChart from 'common/view/chart/DoughnutChart';
import SearchBar from 'common/view/input/SearchBar';
import TopHolderCard from 'common/view/card/TopHolderCard';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderProps {
  topHolders: string[];
  holders: object;
  selHolderAddress: string;
  selHistoryAddress: string;
  onClickDetailButton: (holderAddress: string) => void;
  onChangeSearchInput: (holderAddress: string) => void;
}

interface TokenHolderViewState {
  labels: string[];
  data: number[];
}

class TokenHolderView extends Component<TokenHolderProps, TokenHolderViewState> {
  backgroundColor = [
    'rgba(119, 151, 255,0.7)',
    'rgba(109,170,232,0.7)',
    'rgba(132,215,255,0.7)',
    'rgba(119,255,213,0.7)',
    'rgba(109,132,229,0.7)',
    'rgba(207,153,255,0.7)',
    'rgba(174,159,232,0.7)',
    'rgba(188,195,255,0.7)',
    'rgba(159,190,232,0.7)',
    'rgba(175,234,255,0.7)',
  ];

  _isEveryComponentUndefined(components: any[]) {
    return components.every(component => component === undefined);
  }

  _isStartWith(targetStr: string, compStr: string) {
    return targetStr.toLowerCase().startsWith(compStr.toLowerCase());
  }

  renderTopHolderGraph() {
    const data = this.props.topHolders.map(address => this.props.holders[address]);
    return (
      <Fragment>
        <div className={styles.topTitleBar}>
          <p className={styles.title}>{'Token holder chart'}</p>
        </div>
        <DoughnutChart
          data={data}
          labels={this.props.topHolders}
          backgroundColor={this.backgroundColor}
          borderColor={this.backgroundColor}
          height={300}
        />
      </Fragment>
    );
  }

  renderTopHolderTable() {
    return (
      <Fragment>
        <div className={styles.topTitleBar}>
          <p className={styles.title}>{'Holders'}</p>
          <SearchBar className={styles.searchBar} onChangeSearchInput={this.props.onChangeSearchInput} />
        </div>
        {StringUtil.isEmpty(this.props.selHolderAddress)
          ? this.renderTopTokenHolders()
          : this.renderSelectedTokenHolders()}
      </Fragment>
    );
  }

  renderTopTokenHolders() {
    return this.props.topHolders.map((address, index) => {
      return (
        <TopHolderCard
          key={index}
          rank={index + 1}
          userAddress={address}
          isSelected={address === this.props.selHistoryAddress}
          onClickDetailHistory={this.props.onClickDetailButton}
        />
      );
    });
  }

  renderSelectedTokenHolders() {
    let selectedTokenHolders = Object.keys(this.props.holders).map((address, index) => {
      if (this._isStartWith(address, this.props.selHolderAddress)) {
        return (
          <TopHolderCard
            key={index}
            rank={index + 1}
            userAddress={address}
            isSelected={address === this.props.selHistoryAddress}
            onClickDetailHistory={this.props.onClickDetailButton}
          />
        );
      }
    });
    if (this._isEveryComponentUndefined(selectedTokenHolders)) return this.renderNoTokenHolderResult();
    // if (selectedTokenHolders.length > 5) selectedTokenHolders = selectedTokenHolders.slice(0, 5);
    // console.log(selectedTokenHolders);
    console.log(selectedTokenHolders);
    return selectedTokenHolders;
  }

  renderNoTokenHolderResult() {
    return (
      <div className={styles.tokenHolderResult}>
        <p> Token holder not found</p>
      </div>
    );
  }

  render() {
    return (
      <DashboardContainer className={styles.tokenHolderView}>
        <div className={styles.topHolderGraph}>{this.renderTopHolderGraph()}</div>
        <div className={styles.topHolderTable}>{this.renderTopHolderTable()}</div>
      </DashboardContainer>
    );
  }
}

export default TokenHolderView;
