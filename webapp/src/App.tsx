import React, { Component, Fragment } from 'react';

// agent
import ContractDeployServerAgent from 'common/agent/ContractDeployServerAgent';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import Router from './Router';

interface AppState {
  isInstanceReady: boolean;
}

class App extends Component<{}, {}> {
  state = {
    isInstanceReady: false,
  };

  componentWillMount() {
    TokenDC.setDataReadyListner(this.instanceGetReady.bind(this));
  }

  instanceGetReady() {
    this.setState({ ...this.state, isInstanceReady: true });
  }

  render() {
    const { isInstanceReady } = this.state;
    return (
      <div>
        {isInstanceReady && (
          <Fragment>
            <Router />
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
