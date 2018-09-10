import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Web3 from 'web3';

// view
import Navigation from 'common/view/nav/Navigation';
import DashboardVC from 'dashboard/vc/DashboardVC';
import ContractVC from 'contract/vc/ContractVC';

interface RouterState {
  web3: Web3;
}

class Router extends Component<{}, RouterState> {
  route = [
    {
      path: '/',
      component: DashboardVC,
      exact: true,
    },
    {
      path: '/admin/contract',
      component: ContractVC,
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
