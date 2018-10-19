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
          <p className={styles.caution}>Caution!</p>
          <p>you must login metamask</p>
        </div>
      </Container>
    );
  }
}

export default NoMetamaskView;
