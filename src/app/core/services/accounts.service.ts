import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModelState } from 'src/app/shared/models/financius.enums';
import {
  Account,
  FinanciusBackup,
} from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';
import * as data from 'src/assets/data.json';
import { sortByName } from '../utilities/sort.helpers';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  data: FinanciusBackup = data;
  accounts: Account[] = this.data.accounts.filter(
    (a) => a.model_state === ModelState.Normal
  );

  constructor(private transactionsService: TransactionsService) {}

  get(id: string): Observable<Account | null> {
    return of(this.accounts.find((a) => a.id === id) || null);
  }

  getAll(): Observable<Account[]> {
    return of(this.accounts.sort((a, b) => sortByName(a.title, b.title)));
  }

  getTransactions(accountId: string): Observable<TransactionsViewModel[]> {
    return this.transactionsService.getByAccount(accountId);
  }
}
