import React, { Component, Fragment } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TokenInfoView.scss';

class TokenInfoView extends Component<{}, {}> {
  renderCap() {
    return (
      <Fragment>
        <img className={styles.symbolImg} src={require('../../common/asset/img/rayon-symbol.png')} />
        <p>Rayon Token</p>
      </Fragment>
    );
  }

  renderTokenInfo() {
    return (
      <Fragment>
        <div className={styles.tokenInfo}>
          <p>Token Name:</p>
          <p>Rayon</p>
        </div>
        <div className={styles.tokenInfo}>
          <p>Token Symbol:</p>
          <p>RYN</p>
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <DashboardContainer className={styles.tokenInfoView}>
        <div className={styles.capSection}>{this.renderCap()}</div>
        <div className={styles.tokenInfoSection}>{this.renderTokenInfo()}</div>
      </DashboardContainer>
    );
  }
}

export default TokenInfoView;
