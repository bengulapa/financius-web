import {
  FormStyle,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import * as _ from 'lodash';
import { ChartData } from 'src/app/shared/models/chart.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCardComponent implements OnInit {
  @Input()
  transactions!: TransactionsViewModel[] | null;

  title!: string;
  totalExpense: number = 0;
  currencyCode!: string | null;
  pieData: ChartData[] = [];
  LegendPosition = LegendPosition;

  constructor() {}

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    this.title = getLocaleMonthNames(
      'en',
      FormStyle.Format,
      TranslationWidth.Wide
    )[currentMonth];

    const monthlyExpenses =
      this.transactions?.filter(
        (t) =>
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentDate.getFullYear() &&
          t.transactionType === TransactionType.Expense
      ) || [];

    // TODO: Group per currency code?
    this.currencyCode = monthlyExpenses[0]?.currencyCode;
    this.totalExpense = _.sumBy(monthlyExpenses, 'amount');

    const expensesGroup = _.groupBy(monthlyExpenses, 'category.title');

    this.pieData = Object.keys(expensesGroup).map((e) => ({
      name: e,
      value: _.sumBy(expensesGroup[e], 'amount'),
    }));
  }
}
