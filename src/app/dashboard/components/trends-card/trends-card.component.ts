import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import * as _ from 'lodash';
import { MultiChartData } from 'src/app/shared/models/chart.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-trends-card',
  templateUrl: './trends-card.component.html',
  styleUrls: ['./trends-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendsCardComponent implements OnInit {
  @Input()
  title!: string;

  @Input()
  transactions!: TransactionsViewModel[] | null;

  chartData: MultiChartData[] = [];

  constructor() {}

  ngOnInit(): void {
    const dailyExpenses = _.groupBy(this.transactions, (t) =>
      new Date(t.date).getDate().toLocaleString()
    );

    const groupedDailyExpenses = Object.keys(dailyExpenses).map((day) => ({
      name: day,
      value: _.sumBy(dailyExpenses[day], 'amount'),
    }));

    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth(),
      lastDay = new Date(y, m + 1, 0).getDate();

    const series = _.range(1, lastDay + 1).map((day) => ({
      name: day.toLocaleString(),
      value: groupedDailyExpenses[day]?.value || 0,
    }));

    this.chartData = [
      {
        name: this.title,
        series: series,
      },
    ];
  }
}
