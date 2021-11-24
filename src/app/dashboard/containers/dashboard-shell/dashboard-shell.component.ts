import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsFacade } from 'src/app/accounts/state/accounts.facade';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { getLocaleMonthName } from 'src/app/core/utilities/date.utils';
import { Account, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
})
export class DashboardShellComponent implements OnInit {
  accounts$?: Observable<Account[]>;
  transactions$!: Observable<Transaction[]>;
  expenses$!: Observable<Transaction[]>;
  title!: string;

  constructor(
    public accountsFacade: AccountsFacade,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.accountsFacade.retrieve();

    const currentDate = new Date(),
      currentMonth = currentDate.getMonth(),
      currentYear = currentDate.getFullYear();

    this.title = getLocaleMonthName(currentMonth);

    this.expenses$ = this.transactionsService.getMonthlyExpenses(
      currentMonth,
      currentYear
    );
  }
}
