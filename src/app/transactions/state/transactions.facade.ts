import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Transaction } from 'src/app/shared/models/entities.models';
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

  add(transaction: Transaction) {
    this.store.dispatch(TransactionActions.add({ transaction }));
  }

  update(transaction: Transaction) {
    this.store.dispatch(TransactionActions.update({ transaction }));
  }

  delete(transaction: Transaction) {
    this.store.dispatch(TransactionActions.remove({ transaction }));
  }
}
