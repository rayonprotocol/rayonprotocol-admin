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
    console.log('userAccount', userAccount);
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
        <Link to={'/'}>
          <img src={require('../../../common/asset/img/rayon-white-logo.png')} />
        </Link>
        <div className={styles.navList}>
          <Link to={'/'}>Dashbard</Link>
          <Link to={'/kyc'}>KYC</Link>
          <Link to={'/contract'}>Contract</Link>
        </div>
        <div className={styles.sideNav}>
          {this.state.userAccount === undefined ? this.renderNoUserInfoSideNav() : this.renderUserInfoSideNav()}
        </div>
      </nav>
    );
  }
}

export default Navigation;
