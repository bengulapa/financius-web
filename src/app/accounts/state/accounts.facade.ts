import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Account, Transaction } from 'src/app/shared/models/entities.models';
import { AccountActions } from './accounts.actions';
import * as accountsQuery from './accounts.selectors';

@Injectable({ providedIn: 'root' })
export class AccountsFacade {
  loading$? = this.store.select(accountsQuery.selectLoading);
  entities$? = this.store.select(accountsQuery.selectAccounts);
  activeAccounts$? = this.store.select(accountsQuery.selectActiveAccounts);
  transactions$?: Observable<Transaction[]> = this.store.select(
    accountsQuery.selectAccountTransactions
  );
  account$?: Observable<Account | null> = this.store.select(
    accountsQuery.selectAccount
  );

  constructor(private store: Store) {}

  retrieve() {
    this.store.dispatch(AccountActions.retrieve());
  }

  getByKey(key: string) {
    this.store.dispatch(AccountActions.getByKey({ key }));
  }

  accountViewOpened(accountId: string) {
    this.store.dispatch(AccountActions.accountViewOpened({ accountId }));
  }

  add(account: Account) {
    this.store.dispatch(AccountActions.add({ account }));
  }

  update(account: Account) {
    this.store.dispatch(AccountActions.update({ account }));
  }

  updateAccountBalance(account: Account, amount: number) {
    this.store.dispatch(
      AccountActions.updateAccountBalance({ account, amount })
    );
  }

  delete(account: Account) {
    this.store.dispatch(AccountActions.remove({ account }));
  }
}
