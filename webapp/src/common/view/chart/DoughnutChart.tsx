import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

// model
import ChartData, { DataSets } from 'common/model/chart/ChartData';

interface DoughnutChartProps {
  className?: string;
  labels: string[];
  data: string[];
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
      chartData: new ChartData(),
    };
  }
  render() {
    const { height } = this.props;
    let { chartData } = this.state;

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
      <div className={this.props.className} style={{ height: (height || 100) + 'px' }}>
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
