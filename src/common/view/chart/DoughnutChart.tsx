import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import chartjs from 'chart.js';

// model
import ChartData from 'common/model/chart/ChartData';

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  height?: number;
}

interface DoughnutChartState {
  chartData: ChartData;
}

class DoughnutChart extends Component<DoughnutChartProps, DoughnutChartState> {
  constructor(props) {
    super(props);
    this.state = {
      chartData: new ChartData(props.data, props.labels, props.backgroundColor, props.borderColor, props.borderWidth),
    };
  }
  render() {
    const { height } = this.props;
    let { chartData } = this.state;

    return (
      <div style={{ height: (height || 100) + 'px' }}>
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            barThickness: 2,
            legend: {
              display: false,
            },
          }}
        />
      </div>
    );
  }
}

export default DoughnutChart;
