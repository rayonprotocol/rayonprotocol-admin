import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// model
import Metamask from 'common/model/metamask/Metamask';

// dc
import TokenDC from 'token/dc/TokenDC';
import KycDC from 'kyc/dc/KycDC';

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
    KycDC.setMetamaskLoginListener(this.onMetamaskLogin.bind(this));
    this.setState({ ...this.state, userAccount, networkName });
  }

  onMetamaskLogin(loginResult: Metamask) {
    this.setState({ ...this.state, userAccount: loginResult.selectedAddress });
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
          {/* <a href={''}>Token</a>
          <a href={''}>KYC</a>
          <a href={''}>Contract</a> */}
          <Link to={'/'}>Token</Link>
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
