import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './DashboardContainer.scss';

interface DashboardContainerProps {
  className?: string;
  title?: string;
}

class DashboardContainer extends Component<DashboardContainerProps, {}> {
  render() {
    const { title } = this.props;
    return <div className={classNames(styles.dashboardContainer, this.props.className)}>{this.props.children}</div>;
  }
}

export default DashboardContainer;
