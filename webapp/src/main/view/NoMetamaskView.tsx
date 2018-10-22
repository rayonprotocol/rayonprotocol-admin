import React, { Component } from 'react';

// view
import Container from 'common/view/container/Container';

// styles
import styles from './NoMetamaskView.scss';

class NoMetamaskView extends Component<{}, {}> {
  render() {
    return (
      <Container>
        <div className={styles.noMetamaskView}>
          <div className={styles.image}>
            <img src={require('../image/wallet.png')} />
          </div>
          <div>
            <p className={styles.caution}>Caution!</p>
            <p>This is Admin page</p>
            <p>For account verification, You must login metamask</p>
          </div>
        </div>
      </Container>
    );
  }
}

export default NoMetamaskView;
