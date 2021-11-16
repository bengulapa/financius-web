import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Account, Transaction } from 'src/app/shared/models/entities.models';
import { transactionsQuery } from 'src/app/transactions/state/transactions.selectors';
import { AccountActions } from './accounts.actions';
import { AccountsState } from './accounts.reducer';
import * as accountsQuery from './accounts.selectors';

@Injectable({ providedIn: 'root' })
export class AccountsFacade {
  loading$? = this.store.select(accountsQuery.getLoading);
  entities$? = this.store.select(accountsQuery.getAccounts);
  activeAccounts$? = this.store.select(accountsQuery.getActiveAccounts);
  transactions$?: Observable<Transaction[]> = this.store.select(
    accountsQuery.getTransactions
  );
  account$?: Observable<Account | null> = this.store.select(
    accountsQuery.getAccount
  );

  constructor(private store: Store<AccountsState>) {}

  retrieve() {
    this.store.dispatch(AccountActions.retrieve());
  }

  getByKey(key: string) {
    this.store.dispatch(AccountActions.getByKey({ key }));
  }

  getTransactions(categoryId: string) {
    return this.store.select(
      transactionsQuery.getAccountTransactions({ categoryId })
    );
  }

  add(account: Account) {
    this.store.dispatch(AccountActions.add({ account }));
  }

  update(account: Account) {
    this.store.dispatch(AccountActions.update({ account }));
  }

  delete(account: Account) {
    this.store.dispatch(AccountActions.remove({ account }));
  }
}
