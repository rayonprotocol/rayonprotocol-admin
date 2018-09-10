import React, { Component } from 'react';

// styles
import styles from './NoMetamaskView.scss';

class NoMetamaskView extends Component<{}, {}> {
  render() {
    return (
      <div className={styles.noMetamaskView}>
        <p className={styles.caution}>Caution!</p>
        <p>Only admin can enter this page</p>
        <p>you must login by metamask</p>
      </div>
    );
  }
}

export default NoMetamaskView;
