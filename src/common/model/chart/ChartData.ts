class DataSets {
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

class ChartData {
  labels: string[];
  datasets: DataSets[];

  constructor(data: number[], labels: string[], backgroundColor: string[], borderColor: string[], borderWidth: number) {
    const dataLen = data.length;

    this.labels = labels;
    this.datasets = [new DataSets()];
    this.datasets[0].data = data;
    this.datasets[0].backgroundColor = backgroundColor || new Array(dataLen).fill('rgba(255, 99, 132, 0.2)');
    this.datasets[0].borderColor = borderColor || new Array(dataLen).fill('rgba(255,99,132,1)');
    this.datasets[0].borderWidth = borderWidth || 1;
  }
}

export default ChartData;
