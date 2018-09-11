import React, { Component, Fragment } from 'react';
import AnimatedNumber from 'react-animated-number';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import ProgressBar from 'common/view/progressbar/ProgressBar';

// styles
import styles from './TokenInfoView.scss';

interface TokenInfoViewProps {
  tokenCap: number;
  percentage: number;
}

class TokenInfoView extends Component<TokenInfoViewProps, {}> {
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
        <div className={styles.tokenCap}>
          <p className={styles.subTitle}>Cap</p>
          <p className={styles.capValue}>
            <AnimatedNumber
              component={'span'}
              value={this.props.tokenCap}
              style={{
                transition: '0.8s ease-out',
                fontSize: 48,
                transitionProperty: 'background-color, color, opacity',
                marginRight: '10px',
              }}
              duration={600}
              stepPrecision={1}
              formatValue={num => Math.ceil(num)}
            />
            RYN
          </p>
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <DashboardContainer className={styles.tokenInfoView}>
        <div className={styles.symbolSection}>{this.renderCap()}</div>
        <div className={styles.tokenInfoSection}>{this.renderTokenInfo()}</div>
        <ProgressBar
          className={styles.progressBar}
          percent={this.props.percentage}
          tipText={Math.floor(this.props.percentage).toString() + '%'}
        />
      </DashboardContainer>
    );
  }
}

export default TokenInfoView;
