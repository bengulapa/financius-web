import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as _ from 'lodash';
import { CurrenciesService } from 'src/app/core/services/currencies.service';
import {
  ChartColor,
  SingleChartData,
} from 'src/app/shared/models/chart.models';
import { Currency, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-category-report',
  templateUrl: './category-report.component.html',
  styleUrls: ['./category-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryReportComponent implements OnChanges {
  @Input()
  title!: string;

  @Input()
  transactions?: Transaction[] | null;

  @Input()
  loading?: boolean | null = false;

  @Input()
  mainCurrency!: Currency | null;

  @Output()
  periodChange = new EventEmitter<number>();

  chartData: SingleChartData[] = [];
  customColors: ChartColor[] = [];

  constructor(private currencyService: CurrenciesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transactions?.currentValue) {
      const expensesGroup = _.groupBy(this.transactions, 'category.name');

      this.chartData = _.orderBy(
        Object.keys(expensesGroup).map((e) => ({
          name: e,
          value: _.sumBy(expensesGroup[e], 'amount'),
        })),
        ['value'],
        ['desc']
      );

      this.customColors = Object.keys(expensesGroup).map((e) => ({
        name: e,
        value:
          this.transactions?.find((t) => t.category?.name === e)?.category
            ?.color || '',
      }));
    }
  }

  formatValue = (value: number): string => {
    return this.currencyService.format(value, this.mainCurrency);
  };

  formatPercentage = (value: number): string | number => {
    return Math.round(value) >= 1 ? Math.round(value) : '<1';
  };
}
