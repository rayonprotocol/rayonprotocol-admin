import React, { Component } from 'react';
import classNames from 'classnames';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';

// styles
import styles from './TopDashboardStatusView.scss';

interface TopDashboardStatusViewProps {
  isLoading: boolean;
}

interface TopDashboardStatusViewState {
  updateDate: string;
}

class TopDashboardStatusView extends Component<TopDashboardStatusViewProps, TopDashboardStatusViewState> {
  constructor(props) {
    super(props);
    this.state = {
      updateDate: DateUtil.getCurrentTime(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isLoading && nextProps.isLoading) this.setState({ updateDate: DateUtil.getCurrentTime() });
  }
  render() {
    return (
      <div className={styles.topDashboardStatus}>
        <div className={classNames(styles.loadingStatus, { [styles.isLoading]: this.props.isLoading })}>
          <p>{this.props.isLoading ? '업데이트 중입니다' : '업데이트 완료'}</p>
          <p>{this.state.updateDate}</p>
        </div>
      </div>
    );
  }
}

export default TopDashboardStatusView;
