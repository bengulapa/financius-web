import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Transaction } from 'src/app/shared/models/entities.models';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';

@Component({
  selector: 'app-transactions-shell',
  templateUrl: './transactions-shell.component.html',
  styleUrls: ['./transactions-shell.component.scss'],
})
export class TransactionsShellComponent
  extends EntityBaseComponent<Transaction>
  implements OnInit
{
  constructor(private service: TransactionsService) {
    super();
  }

  ngOnInit(): void {
    this.entities$ = this.service.getTransactions();
    this.loading$ = this.service.loading$;
  }
}
