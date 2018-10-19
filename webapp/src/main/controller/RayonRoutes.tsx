import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// dc
import UserDC from 'user/dc/UserDC';
import RouteController from 'main/controller/RouteController';

// view
import Navigation from 'common/view/nav/Navigation';

interface RouterState {
  userAccount: string;
  isLoading: boolean;
  networkName: string;
}

class Router extends Component<{}, RouterState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isLoading: true,
    };
  }

  async componentWillMount() {
    UserDC.addUserLoginStatusChangeListeners(this._onUserLoginStatusChange.bind(this));
  }

  private _onUserLoginStatusChange(userAccount: string, networkName: string): void {
    this.setState({ ...this.state, userAccount, networkName, isLoading: false });
  }

  renderAdminPage() {
    const route = RouteController.getRoutes(this.state.userAccount);
    return route.map((item, index) => {
      return (
        <Route
          key={index}
          exact={item.exact}
          path={item.path}
          render={props => <item.component {...props} {...this.props} />}
        />
      );
    });
  }

  renderLoading() {
    return <div>Loading</div>;
  }

  render() {
    return (
      <Fragment>
        <BrowserRouter>
          <Fragment>
            <Navigation userAccount={this.state.userAccount} networkName={this.state.networkName} />
            {this.state.isLoading ? this.renderLoading() : this.renderAdminPage()}
          </Fragment>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default Router;
