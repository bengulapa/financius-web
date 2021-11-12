import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Transaction } from 'src/app/shared/models/entities.models';
import { ObservableBaseComponent } from 'src/app/shared/observable-base.component';

@Component({
  selector: 'app-transactions-shell',
  templateUrl: './transactions-shell.component.html',
  styleUrls: ['./transactions-shell.component.scss'],
})
export class TransactionsShellComponent
  extends ObservableBaseComponent
  implements OnInit
{
  transactions$?: Observable<Transaction[]>;

  constructor(private service: TransactionsService) {
    super();
  }

  ngOnInit(): void {
    this.service.getTransactions();
    this.transactions$ = this.service.entities$;
  }
}
