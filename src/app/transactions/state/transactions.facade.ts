import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from './transactions.actions';
import { TransactionsState } from './transactions.reducer';
import { transactionsQuery } from './transactions.selectors';

@Injectable({ providedIn: 'root' })
export class TransactionsFacade {
  loading$? = this.store.select(transactionsQuery.getLoading);
  entities$? = this.store.select(transactionsQuery.getActiveTransactions);

  constructor(private store: Store<TransactionsState>) {}

  retrieve() {
    this.store.dispatch(TransactionActions.retrieve());
  }
}
