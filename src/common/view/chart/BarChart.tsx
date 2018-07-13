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
  width?: number;
  height?: number;
}

interface BarChartState {
  chartData: ChartData;
}

class BarChart extends Component<BarChartProps, BarChartState> {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      ...this.state,
      chartData: new ChartData(props.data, props.labels, props.backgroundColor, props.borderColor, props.borderWidth),
    };
  }

  render() {
    const { width, height } = this.props;
    const { chartData } = this.state;
    return (
      <Bar
        data={chartData}
        width={width && 100}
        height={height && 50}
        options={{
          maintainAspectRatio: false,
        }}
      />
    );
  }
}

export default BarChart;
