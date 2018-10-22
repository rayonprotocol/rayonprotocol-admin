import React, { Component } from 'react';

// view
import Container from 'common/view/container/Container';

// styles
import styles from './OnlyAdminView.scss';

class OnlyAdminView extends Component<{}, {}> {
  render() {
    return (
      <Container>
        <div className={styles.onlyAdminView}>
          <div className={styles.image}>
            <img src={require('../image/security.png')} />
          </div>
          <div>
            <p className={styles.caution}>Caution!</p>
            <p>This is Admin page</p>
            <p>You don't have enter authority</p>
          </div>
        </div>
      </Container>
    );
  }
}

export default OnlyAdminView;
