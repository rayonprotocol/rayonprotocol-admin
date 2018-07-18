import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

// model
import ChartData, { DataSets } from 'common/model/chart/ChartData';

interface LinearChartProps {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  height?: number;
}

interface LinearChartState {
  chartData: ChartData;
}

class LinearChart extends Component<LinearChartProps, LinearChartState> {
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
    // datasets[0].backgroundColor = this.props.backgroundColor || new Array(dataLen).fill('rgba(255, 99, 132, 0.2)');
    datasets[0].fill = false;
    datasets[0].borderColor = this.props.borderColor || new Array(dataLen).fill('rgba(255,99,132,1)');
    datasets[0].borderWidth = this.props.borderWidth || 3;

    console.log('datasets[0].borderColor', datasets[0].borderColor);

    chartData.labels = labels;
    chartData.datasets = datasets;
    return (
      <div style={{ height: (height || 100) + 'px' }}>
        <Line
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

export default LinearChart;
