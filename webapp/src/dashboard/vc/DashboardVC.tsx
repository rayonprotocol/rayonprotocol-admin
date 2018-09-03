import React, { Component } from 'react';

// view
import Container from 'common/view/container/Container';
import TotalTokenView from 'dashboard/view/TotalTokenView';
import TokenHolderView from 'dashboard/view/TokenHolderView';
import TokenHolderGraphView from 'dashboard/view/TokenHolderGraphView';

// styles
import styles from './DashboardVC.scss';

class DashboardVC extends Component<{}, {}> {
  render() {
    return (
      <div className={styles.dashboard}>
        <Container>
          <TotalTokenView />
          <TokenHolderView />
          {/* <TokenHolderGraphView /> */}
        </Container>
      </div>
    );
  }
}

export default DashboardVC;
