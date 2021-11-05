import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
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

  constructor(
    private accountsService: AccountsService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accountsService.getAll();
    this.transactions$ = this.transactionsService.getAll();
  }
}
