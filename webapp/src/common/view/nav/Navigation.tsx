import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// dc
import TokenDC from 'token/dc/TokenDC';

// styles
import styles from './Navigation.scss';

interface NavigationState {
  userAccount: string;
  networkName: string;
}

class Navigation extends Component<{}, NavigationState> {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: undefined,
      networkName: '',
    };
  }

  async componentWillMount() {
    const userAccount = await TokenDC.getUserAccount();
    const networkName = await TokenDC.getNetworkName();
    this.setState({ ...this.state, userAccount, networkName });
  }

  renderNoUserInfoSideNav() {
    return <p className={styles.noMetamaskDesc}>No Metamask</p>;
  }

  renderUserInfoSideNav() {
    return (
      <Fragment>
        <div className={styles.userInfo}>
          <p>Network:</p>
          <p>{this.state.networkName}</p>
        </div>
        <div className={styles.userInfo}>
          <p>Account:</p>
          <p>{this.state.userAccount}</p>
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <nav className={styles.navigation}>
        <img src={require('../../../common/asset/img/rayon-white-logo.png')} />
        <div className={styles.navList}>
          <Link to={'/'}>Dashbard</Link>
          <Link to={'/admin/kyc'}>KYC</Link>
          <Link to={'/admin/contract'}>Contract</Link>
        </div>
        <div className={styles.sideNav}>
          {this.state.userAccount === undefined ? this.renderNoUserInfoSideNav() : this.renderUserInfoSideNav()}
        </div>
      </nav>
    );
  }
}

export default Navigation;
