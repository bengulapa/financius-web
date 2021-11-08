import {
  FormStyle,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { Account } from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
})
export class DashboardShellComponent implements OnInit {
  accounts$!: Observable<Account[]>;
  transactions$!: Observable<TransactionsViewModel[]>;
  expenses$!: Observable<TransactionsViewModel[]>;
  title!: string;

  constructor(
    private accountsService: AccountsService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accountsService.getAll();
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
