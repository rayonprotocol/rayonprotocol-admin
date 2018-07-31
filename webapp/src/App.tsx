import React, { Component, Fragment } from 'react';

// view
import Router from './Router';

class App extends Component<{}, {}> {
  render() {
    return (
      <div>
        <Fragment>
          <Router />
        </Fragment>
      </div>
    );
  }
}

export default App;
