export interface SingleChartData {
  name: string;
  value: number;
  extra?: any;
}

export interface MultiChartData {
  name: string;
  series: SingleChartData[];
}

export interface ChartColor {
  name: string;
  value: string;
}
