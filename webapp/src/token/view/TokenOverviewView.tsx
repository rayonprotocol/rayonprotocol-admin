import React, { Component } from 'react';

// view
import SectionTitle from 'common/view/section/SectionTitle';

// styles
import styles from './TokenOverviewView.scss';

class TokenOverviewView extends Component<{}, {}> {
  render() {
    return (
      <div className={styles.tokenOverview}>
        <SectionTitle title={'Rayon'} />
        <div className={styles.overviewBody}>
          <div>
            <p>Token supply</p>
            <p>640 RYN</p>
          </div>
          <div>
            <p>Token Name</p>
            <p>Rayon</p>
          </div>
          <div>
            <p>Token Symbol</p>
            <p>640 RYN</p>
          </div>
          <div>
            <p>Cap</p>
            <p>640 RYN</p>
          </div>
        </div>
      </div>
    );
  }
}

export default TokenOverviewView;
