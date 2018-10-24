import React, { Component } from 'react';

// view
import SectionTitle from 'common/view/section/SectionTitle';
import ProgressBar from 'common/view/progressbar/ProgressBar';

// styles
import styles from './TokenOverviewView.scss';

interface TokenOverviewViewProps {
  totalSupply: number;
  tokenCap: number;
}

class TokenOverviewView extends Component<TokenOverviewViewProps, {}> {
  render() {
    const percentage = (this.props.totalSupply / this.props.tokenCap) * 100;
    return (
      <div className={styles.tokenOverview}>
        <SectionTitle title={'Rayon Token Overview'} />
        <div className={styles.overviewBody}>
          <div className={styles.topSection}>
            <div className={styles.tokenName}>
              <img src={require('../../common/asset/img/rayon-symbol.png')} />
              <p>Rayon Token</p>
            </div>
            <div>
              <div className={styles.tokenSection}>
                <div className={styles.totalSupply}>
                  <p>Token total supply</p>
                  <p>{`${this.props.totalSupply} RYN`}</p>
                </div>
                <div className={styles.tokenCap}>
                  <p>Cap</p>
                  <p>{`${this.props.tokenCap} RYN`}</p>
                </div>
              </div>
              <ProgressBar
                className={styles.progressBar}
                percent={percentage}
                tipText={Math.floor(percentage).toString() + '%'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TokenOverviewView;
