import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { format, getDate, getDay, getMonth } from 'date-fns';
import * as _ from 'lodash';
import { getLocaleShortDayName } from 'src/app/core/utilities/date.utils';
import { MultiChartData } from 'src/app/shared/models/chart.models';
import { Currency, Transaction } from 'src/app/shared/models/entities.models';
import { Period } from 'src/app/shared/models/view.models';

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

  @Input()
  selectedPeriod!: Period;

  chartData: MultiChartData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transactions?.currentValue || changes.selectedPeriod?.currentValue) {
      const series = this.getPeriodSeries(this.selectedPeriod);

      this.chartData = [
        {
          name: this.title,
          series: series,
        },
      ];
    }
  }

  private getPeriodSeries(period: Period) {
    const now = new Date(),
      y = now.getFullYear(),
      m = now.getMonth();

    switch (period) {
      default:
      case Period.Month: {
        const dailyExpenses = _.groupBy(this.transactions, (t) => getDate(t.date).toLocaleString());

        const groupedDailyExpenses = Object.keys(dailyExpenses).map((date) => ({
          name: date,
          value: _.sumBy(dailyExpenses[date], 'amount'),
        }));

        const lastDay = new Date(y, m + 1, 0).getDate();

        return _.range(1, lastDay + 1).map((date) => ({
          name: date.toLocaleString(),
          value: groupedDailyExpenses.find((e) => e.name === date.toLocaleString())?.value || 0,
        }));
      }

      case Period.Year: {
        const monthlyExpenses = _.groupBy(this.transactions, (t) => getMonth(t.date));

        const groupedMonthlyExpenses = Object.keys(monthlyExpenses).map((month) => ({
          name: month,
          value: _.sumBy(monthlyExpenses[month], 'amount'),
        }));

        return _.range(0, 12).map((month) => ({
          name: format(new Date(y, month, 1), 'MMM'),
          value: groupedMonthlyExpenses.find((e) => e.name === month.toLocaleString())?.value || 0,
        }));
      }

      case Period.Day:
      case Period.Week: {
        const weeklyExpenses = _.groupBy(this.transactions, (t) => getDay(t.date));

        const groupedWeeklyExpenses = Object.keys(weeklyExpenses).map((day) => ({
          name: day,
          value: _.sumBy(weeklyExpenses[day], 'amount'),
        }));

        return _.range(0, 7).map((day) => ({
          name: getLocaleShortDayName(day),
          value: groupedWeeklyExpenses.find((e) => e.name === day.toLocaleString())?.value || 0,
        }));
      }
    }
  }
}
