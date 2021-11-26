import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as _ from 'lodash';
import { MultiChartData } from 'src/app/shared/models/chart.models';
import { Currency, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-trends-card',
  templateUrl: './trends-card.component.html',
  styleUrls: ['./trends-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendsCardComponent implements OnChanges {
  @Input()
  title!: string;

  @Input()
  transactions!: Transaction[] | null;

  @Input()
  mainCurrency!: Currency | null;

  chartData: MultiChartData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transactions?.currentValue) {
      const dailyExpenses = _.groupBy(this.transactions, (t) =>
        new Date(t.date).getDate().toLocaleString()
      );

      const groupedDailyExpenses = Object.keys(dailyExpenses).map((day) => ({
        name: day,
        value: _.sumBy(dailyExpenses[day], 'amount'),
      }));

      const now = new Date(),
        y = now.getFullYear(),
        m = now.getMonth(),
        lastDay = new Date(y, m + 1, 0).getDate();

      const series = _.range(1, lastDay + 1).map((day) => ({
        name: day.toLocaleString(),
        value:
          groupedDailyExpenses.find((e) => e.name === day.toLocaleString())
            ?.value || 0,
      }));

      this.chartData = [
        {
          name: this.title,
          series: series,
        },
      ];
    }
  }
}
