import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import * as _ from 'lodash';
import {
  SingleChartData,
  ChartColor,
} from 'src/app/shared/models/chart.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';
import { ColorHexPipe } from 'src/app/shared/pipes/color-hex.pipe';
import { CustomCurrencyPipe } from 'src/app/shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-category-report',
  templateUrl: './category-report.component.html',
  styleUrls: ['./category-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryReportComponent implements OnInit {
  @Input()
  title!: string;

  @Input()
  transactions!: TransactionsViewModel[] | null;

  currencyCode!: string | null;
  chartData: SingleChartData[] = [];
  customColors: ChartColor[] = [];

  constructor() {}

  ngOnInit(): void {
    this.currencyCode = this.transactions?.length
      ? this.transactions[0].currencyCode
      : '';

    const expensesGroup = _.groupBy(this.transactions, 'category.title');

    this.chartData = Object.keys(expensesGroup).map((e) => ({
      name: e,
      value: _.sumBy(expensesGroup[e], 'amount'),
    }));

    this.customColors = Object.keys(expensesGroup).map((e) => ({
      name: e,
      value: new ColorHexPipe().transform(
        this.transactions?.find((t) => t.category?.title === e)?.category?.color
      ),
    }));
  }

  formatValue = (value: number): string => {
    return new CustomCurrencyPipe().transform(value, this.currencyCode);
  };

  formatPercentage = (value: number): number => {
    return Math.round(value);
  };
}
