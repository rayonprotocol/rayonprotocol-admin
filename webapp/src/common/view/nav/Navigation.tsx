import React, { Component } from 'react';

// styles
import styles from './Navigation.scss';

class Navigation extends Component<{}, {}> {
  render() {
    return (
      <nav className={styles.navigation}>
        <img src={require('../../../common/asset/img/rayon-white-logo.png')} />
      </nav>
    );
  }
}

export default Navigation;
