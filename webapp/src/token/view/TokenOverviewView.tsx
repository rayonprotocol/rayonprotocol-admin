import React, { Component } from 'react';

// view
import SectionTitle from 'common/view/section/SectionTitle';

// styles
import styles from './TokenOverviewView.scss';

interface TokenOverviewViewProps {
  totalSupply: number;
  tokenCap: number;
}

class TokenOverviewView extends Component<TokenOverviewViewProps, {}> {
  render() {
    return (
      <div className={styles.tokenOverview}>
        <SectionTitle title={'Rayon Token Overview'} />
        <div className={styles.overviewBody}>
          <div>
            <p>Token Name</p>
            <p>Rayon</p>
          </div>
          <div>
            <p>Token Symbol</p>
            <p>640 RYN</p>
          </div>
          <div>
            <p>Token total supply</p>
            <p>{`${this.props.totalSupply} RYN`}</p>
          </div>
          <div>
            <p>Cap</p>
            <p>{`${this.props.tokenCap} RYN`}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default TokenOverviewView;
