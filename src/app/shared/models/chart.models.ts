export interface SingleChartData {
  name: string;
  value: number | string;
  extra?: any;
}

export interface MultiChartData {
  name: string;
  series: SingleChartData[];
}
