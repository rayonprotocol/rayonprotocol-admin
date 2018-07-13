import React, { Component, Fragment } from 'react';

// view
import Container from 'common/view/container/Container';
import TotalTokenView from 'dashboard/view/TotalTokenView';
import TransferTokenView from 'dashboard/view/TransferTokenView';
import TransactionView from 'dashboard/view/TransactionView';

// styles
import styles from './DashboardVC.scss';

class DashboardVC extends Component<{}, {}> {
  render() {
    return (
      <div className={styles.dashboard}>
        <Container>
          <TotalTokenView />
          <TransferTokenView />
          <TransactionView />
        </Container>
      </div>
    );
  }
}

export default DashboardVC;
