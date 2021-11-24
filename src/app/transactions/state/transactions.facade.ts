import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionActions } from './transactions.actions';
import * as transactionsQuery from './transactions.selectors';

@Injectable({ providedIn: 'root' })
export class TransactionsFacade {
  loading$? = this.store.select(transactionsQuery.selectLoading);
  entities$? = this.store.select(transactionsQuery.selectActiveTransactions);

  constructor(private store: Store) {}

  retrieve() {
    this.store.dispatch(TransactionActions.retrieve());
  }

  add(transaction: Transaction) {
    this.store.dispatch(TransactionActions.add({ transaction }));
  }

  update(old: Transaction, update: Transaction) {
    this.store.dispatch(TransactionActions.update({ old, update }));
  }

  delete(transaction: Transaction) {
    this.store.dispatch(TransactionActions.remove({ transaction }));
  }
}
