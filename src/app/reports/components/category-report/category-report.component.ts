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
import { CurrenciesService } from 'src/app/core/services/currency.service';
import {
  ChartColor,
  SingleChartData,
} from 'src/app/shared/models/chart.models';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';
import { ColorHexPipe } from 'src/app/shared/pipes/color-hex.pipe';

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
  transactions?: Transaction[];

  @Output()
  periodChange = new EventEmitter<number>();

  currencyCode!: string | null;
  chartData: SingleChartData[] = [];
  customColors: ChartColor[] = [];

  constructor(private currencyService: CurrenciesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transactions?.currentValue) {
      this.currencyCode = 'PHP';

      const expensesGroup = _.groupBy(this.transactions, 'category.title');

      this.chartData = _.orderBy(
        Object.keys(expensesGroup).map((e) => ({
          name: e,
          value: this.currencyService.convert(
            _.sumBy(expensesGroup[e], 'amount'),
            this.currencyCode
          ),
        })),
        ['value'],
        ['desc']
      );

      this.customColors = Object.keys(expensesGroup).map((e) => ({
        name: e,
        value: new ColorHexPipe().transform(
          this.transactions?.find((t) => t.category?.title === e)?.category
            ?.color
        ),
      }));
    }
  }

  formatValue = (value: number): string => {
    return this.currencyService.format(value, this.currencyCode);
  };

  formatPercentage = (value: number): any => {
    return Math.round(value) >= 1 ? Math.round(value) : '<1';
  };
}
