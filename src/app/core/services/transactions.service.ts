import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from 'src/app/shared/models/entities.models';
import {
  ModelState,
  TransactionState,
  TransactionType,
} from 'src/app/shared/models/financius.enums';
import { EntityBaseDataService } from './entity-base.service';

@Injectable({ providedIn: 'root' })
export class TransactionsService extends EntityBaseDataService<Transaction> {
  get transactions$(): Observable<Transaction[]> {
    return super
      .getAll()
      .pipe(
        map((e) =>
          e.filter(
            (t) =>
              t.transactionState === TransactionState.Confirmed &&
              t.modelState === ModelState.Normal
          )
        )
      );
  }

  constructor(dbService: NgxIndexedDBService) {
    super(dbService);
    super.name = 'transactions';
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  getByAccount(accountId: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((ts) =>
        ts.filter(
          (t) =>
            t.accountTo?.id === accountId || t.accountFrom?.id === accountId
        )
      )
    );
  }

  getByCategory(categoryId: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((ts) => ts.filter((t) => t.category?.id === categoryId))
    );
  }

  getByTag(tagId: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((ts) => ts.filter((t) => t.tags?.map((t) => t.id).includes(tagId)))
    );
  }

  getMonthlyExpenses(month: number, year: number): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((ts) =>
        ts.filter(
          (t) =>
            new Date(t.date).getMonth() === month &&
            new Date(t.date).getFullYear() === year &&
            t.transactionType === TransactionType.Expense &&
            t.includeInReports
        )
      )
    );
  }
}
