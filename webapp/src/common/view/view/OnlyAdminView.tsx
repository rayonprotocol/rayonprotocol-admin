import React, { Component } from 'react';

// styles
import styles from './OnlyAdminView.scss';

class OnlyAdminView extends Component<{}, {}> {
  render() {
    return (
      <div className={styles.onlyAdminView}>
        <p className={styles.caution}>Caution!</p>
        <p>Only admin can enter this page</p>
      </div>
    );
  }
}

export default OnlyAdminView;
