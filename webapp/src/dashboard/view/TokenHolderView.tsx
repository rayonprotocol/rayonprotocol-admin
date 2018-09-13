import React, { Component, Fragment } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import DoughnutChart from 'common/view/chart/DoughnutChart';
import SearchBar from 'common/view/input/SearchBar';
import TopHolderCard from 'common/view/card/TopHolderCard';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderProps {
  onClickHolderAddress: (holderAddress: string) => void;
  onClickSearchButton: (target: string) => void;
  holders: object;
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

  renderTopHolderGraph(holdersList: string[]) {
    const data = holdersList.map(address => this.props.holders[address]);
    return (
      <Fragment>
        <div className={styles.topTitleBar}>
          <p className={styles.title}>{'Token holder chart'}</p>
        </div>
        <DoughnutChart
          data={data}
          labels={holdersList}
          backgroundColor={this.backgroundColor}
          borderColor={this.backgroundColor}
          height={300}
        />
      </Fragment>
    );
  }

  renderTopHolderTable(holdersList: string[]) {
    return (
      <Fragment>
        <div className={styles.topTitleBar}>
          <p className={styles.title}>{'Holders'}</p>
          <SearchBar className={styles.searchBar} onClickSearchButton={this.props.onClickSearchButton} />
        </div>

        {holdersList.map((address, index) => {
          return (
            <TopHolderCard
              rank={index + 1}
              userAddress={address}
              onClickDetailHistory={this.props.onClickHolderAddress}
            />
          );
        })}

        {/* <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {holdersList.map((address, index) => {
              return (
                <tr key={index} onClick={() => this.props.onClickHolderAddress(address)}>
                  <td>{index + 1}</td>
                  <td>{address}</td>
                  <td>{this.props.holders[address]} RYN</td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
      </Fragment>
    );
  }
  render() {
    const holdersList = Object.keys(this.props.holders);
    return (
      <DashboardContainer className={styles.tokenHolderView}>
        <div className={styles.topHolderGraph}>{this.renderTopHolderGraph(holdersList)}</div>
        <div className={styles.topHolderTable}>{this.renderTopHolderTable(holdersList)}</div>
      </DashboardContainer>
    );
  }
}

export default TokenHolderView;
