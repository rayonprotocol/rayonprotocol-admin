import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './rayonTab.scss';

interface RayonTabProps {
  tabs: string[];
  selectedTab: string;
  className?: string;
  onClickTab: (tabName: string) => void;
}

class RayonTab extends Component<RayonTabProps, {}> {
  render() {
    return (
      <div className={classNames(styles.rayonTab, this.props.className)}>
        <div className={styles.tabs}>
          {this.props.tabs.map((tab, index) => {
            return (
              <div
                className={classNames(styles.tab, { [styles.selectedTab]: tab === this.props.selectedTab })}
                key={index}
              >
                <span
                  onClick={event => {
                    this.props.onClickTab(tab);
                  }}
                >
                  {tab}
                </span>
              </div>
            );
          })}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default RayonTab;
