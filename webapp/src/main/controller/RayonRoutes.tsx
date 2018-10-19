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
}

class Router extends Component<{}, RouterState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      userAccount: UserDC.getUserAcount(),
      isLoading: true,
    };
  }

  async componentWillMount() {
    UserDC.addUserLoginStatusChangeListeners(this._onUserLoginStatusChange.bind(this));
  }

  private _onUserLoginStatusChange(userAccount: string): void {
    this.setState({ ...this.state, userAccount, isLoading: false });
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
            <Navigation />
            {this.state.isLoading ? this.renderLoading() : this.renderAdminPage()}
          </Fragment>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default Router;
