import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, Transaction } from 'src/app/shared/models/entities.models';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { EntityBaseService } from './entity-base.service';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class AccountsService extends EntityBaseService<Account> {
  readonly name = 'accounts';

  constructor(
    dbService: NgxIndexedDBService,
    private transactionsService: TransactionsService
  ) {
    super(dbService);
  }

  getAccounts() {
    return super
      .getAll()
      .pipe(map((e) => e.filter((c) => c.modelState === ModelState.Normal)));
  }

  getTransactions(accountId: string): Observable<Transaction[]> {
    return this.transactionsService.getByAccount(accountId);
  }
}
