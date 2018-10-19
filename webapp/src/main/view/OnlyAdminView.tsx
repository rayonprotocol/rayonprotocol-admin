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
          <p className={styles.caution}>Caution!</p>
          <p>Only admin can enter this page</p>
        </div>
      </Container>
    );
  }
}

export default OnlyAdminView;
