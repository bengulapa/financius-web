import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import * as _ from 'lodash';
import {
  ChartColor,
  SingleChartData,
} from 'src/app/shared/models/chart.models';
import { Currency, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCardComponent implements OnChanges {
  @Input()
  title!: string;

  @Input()
  transactions?: Transaction[] | null;

  @Input()
  mainCurrency!: Currency | null;

  totalExpense: number = 0;
  pieData: SingleChartData[] = [];
  LegendPosition = LegendPosition;
  customColors: ChartColor[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transactions?.currentValue) {
      this.totalExpense = _.sumBy(this.transactions, 'amount');

      const expensesGroup = _.groupBy(this.transactions, 'category.name');

      this.pieData = Object.keys(expensesGroup).map((e) => ({
        name: e,
        value: _.sumBy(expensesGroup[e], 'amount'),
      }));

      this.customColors = Object.keys(expensesGroup).map((e) => ({
        name: e,
        value:
          this.transactions?.find((t) => t.category?.name === e)?.category
            ?.color || '',
      }));
    }
  }
}
