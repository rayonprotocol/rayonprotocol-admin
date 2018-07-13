import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

// model
import ChartData from 'common/model/ChartData';

// styles
import styles from './BarChart.scss';

interface BarChartProps {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  height?: number;
}

interface BarChartState {
  chartData: ChartData;
}

class BarChart extends Component<BarChartProps, BarChartState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      chartData: new ChartData(props.data, props.labels, props.backgroundColor, props.borderColor, props.borderWidth),
    };
  }

  render() {
    const { height } = this.props;
    const { chartData } = this.state;
    return (
      <div style={{ height: (height || 100) + 'px' }}>
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            barThickness: 2,
          }}
        />
      </div>
    );
  }
}

export default BarChart;
