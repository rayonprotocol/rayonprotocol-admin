import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// dc
import TokenDC from 'token/dc/TokenDC';

// nav
import Navigation from 'common/view/nav/Navigation';

// view
import DashboardVC from 'dashboard/vc/DashboardVC';

class Router extends Component<{}, {}> {
  route = [
    {
      path: '/',
      component: DashboardVC,
      exact: true,
    },
  ];

  render() {
    return (
      <Fragment>
        <BrowserRouter>
          <Fragment>
            <Navigation />
            {this.route.map((item, index) => {
              return (
                <Route
                  key={index}
                  exact={item.exact}
                  path={item.path}
                  render={props => <item.component {...props} {...this.props} />}
                />
              );
            })}
          </Fragment>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default Router;
