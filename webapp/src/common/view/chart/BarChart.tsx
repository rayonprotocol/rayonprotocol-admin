import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

// model
import ChartData, { DataSets } from 'common/model/chart/ChartData';

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
      chartData: new ChartData(),
    };
  }

  render() {
    const { height } = this.props;
    const { chartData } = this.state;

    const { labels } = this.props;
    const dataLen = this.props.data.length;
    const datasets = [new DataSets()];
    datasets[0].data = this.props.data;
    datasets[0].backgroundColor = this.props.backgroundColor || new Array(dataLen).fill('rgba(255, 99, 132, 0.2)');
    datasets[0].borderColor = this.props.borderColor || new Array(dataLen).fill('rgba(255,99,132,1)');
    datasets[0].borderWidth = this.props.borderWidth || 1;

    chartData.labels = labels;
    chartData.datasets = datasets;
    return (
      <div style={{ height: (height || 100) + 'px' }}>
        <Bar
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

export default BarChart;
