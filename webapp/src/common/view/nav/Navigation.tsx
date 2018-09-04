import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// styles
import styles from './Navigation.scss';

class Navigation extends Component<{}, {}> {
  render() {
    return (
      <nav className={styles.navigation}>
        <img src={require('../../../common/asset/img/rayon-white-logo.png')} />
        <div className={styles.navList}>
          <Link to={'/'}>Dashbard</Link>
          <Link to={'/kyc'}>KYC</Link>
          <Link to={'/contract'}>Contract</Link>
        </div>
      </nav>
    );
  }
}

export default Navigation;
