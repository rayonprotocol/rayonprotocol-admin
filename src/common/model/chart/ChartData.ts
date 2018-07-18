export class DataSets {
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
  fill:boolean;
}

class ChartData {
  labels: string[];
  datasets: DataSets[];
}

export default ChartData;
