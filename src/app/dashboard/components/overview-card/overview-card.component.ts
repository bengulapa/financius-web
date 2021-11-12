import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import * as _ from 'lodash';
import {
  ChartColor,
  SingleChartData,
} from 'src/app/shared/models/chart.models';
import { Transaction } from 'src/app/shared/models/entities.models';
import { ColorHexPipe } from 'src/app/shared/pipes/color-hex.pipe';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCardComponent implements OnInit {
  @Input()
  title!: string;

  @Input()
  transactions!: Transaction[] | null;

  totalExpense: number = 0;
  currencyCode!: string | null;
  pieData: SingleChartData[] = [];
  LegendPosition = LegendPosition;
  customColors: ChartColor[] = [];

  constructor() {}

  ngOnInit(): void {
    // TODO: Group per currency code?
    this.currencyCode = 'PHP';
    this.totalExpense = _.sumBy(this.transactions, 'amount');

    const expensesGroup = _.groupBy(this.transactions, 'category.name');

    this.pieData = Object.keys(expensesGroup).map((e) => ({
      name: e,
      value: _.sumBy(expensesGroup[e], 'amount'),
    }));

    this.customColors = Object.keys(expensesGroup).map((e) => ({
      name: e,
      value: new ColorHexPipe().transform(
        this.transactions?.find((t) => t.category?.name === e)?.category?.color
      ),
    }));
  }
}
