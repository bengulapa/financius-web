import {
  FormStyle,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import {
  ChartColor,
  SingleChartData,
} from 'src/app/shared/models/chart.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-reports-shell',
  templateUrl: './reports-shell.component.html',
  styleUrls: ['./reports-shell.component.scss'],
})
export class ReportsShellComponent implements OnInit {
  transactions$!: Observable<TransactionsViewModel[]> | null;
  expenses$!: Observable<TransactionsViewModel[]>;

  title!: string;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.transactions$ = this.transactionsService.getAll();

    const currentDate = new Date(),
      currentMonth = currentDate.getMonth();

    this.title = getLocaleMonthNames(
      'en',
      FormStyle.Format,
      TranslationWidth.Wide
    )[currentMonth];

    this.expenses$ = this.transactions$.pipe(
      map((ts) =>
        ts.filter(
          (t) =>
            new Date(t.date).getMonth() === currentMonth &&
            new Date(t.date).getFullYear() === currentDate.getFullYear() &&
            t.transactionType === TransactionType.Expense
        )
      )
    );
  }
}
