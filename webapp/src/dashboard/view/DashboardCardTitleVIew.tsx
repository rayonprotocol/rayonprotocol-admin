import React, { Component } from 'react';

// styles
import styles from './DashboardCardTitleView.scss';

interface DashboardCardTitleViewProps {
  title: string;
}

class DashboardCardTitleView extends Component<DashboardCardTitleViewProps, {}> {
  render() {
    return <div className={styles.dashboardCardTitle}>{this.props.title}</div>;
  }
}

export default DashboardCardTitleView;
