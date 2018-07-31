import React, { Component, Fragment } from 'react';

// agent
import ContractDeployServerAgent from 'common/agent/ContractDeployServerAgent';

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
    // add contract instance listner for instance loading
    ContractDeployServerAgent.setInstanceReadyListner(this.instanceGetReady.bind(this));
    ContractDeployServerAgent.contractInit();
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
