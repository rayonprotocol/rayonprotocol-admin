import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Blockies from 'react-blockies';

// view
import Container from 'common/view/container/Container';

// util
import StringUtil from '../../../../../shared/common/util/StringUtil';

// styles
import styles from './Navigation.scss';

interface NavigationProps {
  userAccount: string;
  networkName: string;
}

interface NavigationState {
  selMenu: string;
}

interface NavMenus {
  to: string;
  name: string;
}

class Navigation extends Component<NavigationProps, NavigationState> {
  private _navMenus: NavMenus[] = [
    {
      to: '/',
      name: 'Token',
    },
    {
      to: '/kyc',
      name: 'KYC',
    },
    {
      to: '/contract',
      name: 'Contract',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      selMenu: 'Token',
    };
  }

  onClickMunu(name: string) {
    this.setState({ ...this.state, selMenu: name });
  }

  renderNetworkStatusBar() {
    return (
      <div className={styles.networkStatusBarOuter}>
        <Container className={styles.networkStatusBarInner}>{`Current Network : ${this.props.networkName}`}</Container>
      </div>
    );
  }

  renderRightSideNav() {
    return (
      <div className={styles.navRightSide}>
        <span className={styles.identicon}>
          {StringUtil.isEmpty(this.props.userAccount) ? (
            <p className={styles.emptyBlockies} />
          ) : (
            <Blockies seed={this.props.userAccount} bgColor={'#fff'} />
          )}
        </span>
        <span className={styles.userAddr}>
          {StringUtil.isEmpty(this.props.userAccount) ? 'No User' : StringUtil.trimAddress(this.props.userAccount)}
        </span>
      </div>
    );
  }

  renderLeftSideNav() {
    return (
      <div className={styles.navLeftSide}>
        <Link to={'/'}>
          <img src={require('../../../common/asset/img/rayon-white-logo.png')} />
        </Link>
        {this._navMenus.map((menu, index) => {
          return (
            <Link
              key={index}
              className={this.state.selMenu === menu.name && styles.selMenu}
              onClick={() => this.onClickMunu(menu.name)}
              to={menu.to}
            >
              {menu.name}
            </Link>
          );
        })}
      </div>
    );
  }

  renderPageTitleBar() {
    return (
      <div className={styles.pageTitleOuter}>
        <Container className={styles.pageTitleInner}>
          <p className={styles.pageTitle}>{this.state.selMenu}</p>
        </Container>
        <div className={styles.barUnderLine}></div>
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        {this.props.networkName && this.renderNetworkStatusBar()}
        <nav className={styles.navOuter}>
          <Container className={styles.navInner}>
            {this.renderLeftSideNav()}
            {this.renderRightSideNav()}
          </Container>
        </nav>
        {this.renderPageTitleBar()}
      </Fragment>
    );
  }
}

export default Navigation;
