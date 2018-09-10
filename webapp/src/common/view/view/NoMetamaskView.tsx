import React, { Component } from 'react';

// styles
import styles from './NoMetamaskView.scss';

class NoMetamaskView extends Component<{}, {}> {
  render() {
    return (
      <div className={styles.noMetamaskView}>
        <p className={styles.caution}>Caution!</p>
        <p>you must login metamask</p>
      </div>
    );
  }
}

export default NoMetamaskView;
