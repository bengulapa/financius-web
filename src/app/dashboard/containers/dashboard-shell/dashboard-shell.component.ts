import {
  FormStyle,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Account, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
})
export class DashboardShellComponent implements OnInit {
  accounts$!: Observable<Account[]>;
  transactions$!: Observable<Transaction[]>;
  expenses$!: Observable<Transaction[]>;
  title!: string;

  constructor(
    private accountsService: AccountsService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accountsService.getAccounts();
    this.transactions$ = this.transactionsService.getTransactions();

    const currentDate = new Date(),
      currentMonth = currentDate.getMonth(),
      currentYear = currentDate.getFullYear();

    this.title = getLocaleMonthNames(
      'en',
      FormStyle.Format,
      TranslationWidth.Wide
    )[currentMonth];

    this.expenses$ = this.transactionsService.getMonthlyExpenses(
      currentMonth,
      currentYear
    );
  }
}
