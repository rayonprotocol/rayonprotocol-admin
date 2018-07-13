import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

// view
import BarChart from 'common/view/chart/BarChart';
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TransactionView.scss';

class TranscationView extends Component<{}, {}> {
  labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  data = [12, 19, 3, 5, 2, 3];
  backgroundColor = new Array(this.data.length).fill('rgb(0, 151, 198)');
  borderColor = new Array(this.data.length).fill('rgb(0, 151, 198)');
  render() {
    return (
      <DashboardContainer className={styles.transcationView} title={'Transcations'}>
        <BarChart
          data={this.data}
          labels={this.labels}
          backgroundColor={this.backgroundColor}
          borderColor={this.borderColor}
        />
      </DashboardContainer>
    );
  }
}

export default TranscationView;
