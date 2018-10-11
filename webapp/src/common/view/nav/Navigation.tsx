import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// dc
import UserDC from 'user/dc/UserDC';

// util
import StringUtil from '../../../../../shared/common/util/StringUtil';

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
      ...this.state,
    };
  }

  async componentWillMount() {
    UserDC.addUserLoginStatusChangeListeners(this.onUserLoginStatusChange.bind(this));
  }

  onUserLoginStatusChange(userAccount: string, networkName: string) {
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
          <Link to={'/'}>Token</Link>
          <Link to={'/kyc'}>KYC</Link>
          <Link to={'/contract'}>Contract</Link>
        </div>
        <div className={styles.sideNav}>
          {StringUtil.isEmpty(this.state.userAccount) ? this.renderNoUserInfoSideNav() : this.renderUserInfoSideNav()}
        </div>
      </nav>
    );
  }
}

export default Navigation;
