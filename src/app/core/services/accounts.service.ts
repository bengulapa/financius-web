import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, Transaction } from 'src/app/shared/models/entities.models';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class AccountsService extends EntityCollectionServiceBase<Account> {
  constructor(
    private transactionsService: TransactionsService,
    factory: EntityCollectionServiceElementsFactory
  ) {
    super('Account', factory);
  }

  getCategories() {
    return this.entities$.pipe(
      map((e) => e.filter((c) => c.modelState === ModelState.Normal))
    );
  }

  getTransactions(accountId: string): Observable<Transaction[]> {
    return this.transactionsService.getByAccount(accountId);
  }
}
