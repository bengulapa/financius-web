import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, tap } from 'rxjs/operators';
import { AccountActions } from 'src/app/accounts/state/accounts.actions';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { round } from 'src/app/core/utilities/number.utils';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import { DashboardActions } from 'src/app/dashboard/state/dashboard.actions';
import { ReportsActions } from 'src/app/reports/state/reports.actions';
import { Account, Transaction } from 'src/app/shared/models/entities.models';
import { TransactionState, TransactionType } from 'src/app/shared/models/financius.enums';
import { TransactionActions } from './transactions.actions';
import * as transactionsQuery from './transactions.selectors';

@Injectable()
export class TransactionsEffects {
  retrieve$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionActions.retrieve),
      // Don't load if we've already loaded.
      concatLatestFrom(() => this.store.select(transactionsQuery.selectEntitiesLoaded)),
      filter(([_, loaded]) => !loaded),
      // Don't handle more than one load request at a time.
      exhaustMap(() =>
        this.service.getAll().pipe(
          map(
            (transactions) => TransactionActions.retrieveSuccess({ transactions }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while retrieving transactions.';
              console.log(err);
              return of(TransactionActions.retrieveFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  loadTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TransactionActions.indexPageOpened,
        DashboardActions.dashboardPageOpened,
        ReportsActions.reportsPageOpened,
        AccountActions.accountViewOpened
      ),
      mergeMap(() => of(TransactionActions.retrieve()))
    );
  });

  resetFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.dashboardPageOpened),
      mergeMap(() => of(TransactionActions.resetFilter()))
    );
  });

  add$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionActions.add),
      mergeMap((action) =>
        this.service.add(action.transaction).pipe(
          map(
            (transaction) => TransactionActions.addSuccess({ transaction }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while adding a transaction.';
              console.log(err);
              return of(TransactionActions.addFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  addTransactionOnAddAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.addSuccess),
      filter((a) => a.account.balance !== 0),
      mergeMap(({ account }) =>
        this.service.add(this.buildAccountBalanceUpdateTransaction(account)).pipe(
          map(
            (transaction) => TransactionActions.addSuccess({ transaction }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while adding a transaction.';
              console.log(err);
              return of(TransactionActions.addFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  addTransactionOnUpdateAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.updateSuccess),
      mergeMap(({ account }) =>
        this.service.add(this.buildAccountBalanceUpdateTransaction(<Account>account.changes)).pipe(
          map(
            (transaction) => TransactionActions.addSuccess({ transaction }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while adding a transaction.';
              console.log(err);
              return of(TransactionActions.addFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  updateTransactionAccountOnAdd$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TransactionActions.addSuccess),
        filter((t) => t.transaction.note !== this.accountBalanceUpdate),
        concatLatestFrom(() => this.store.select(transactionsQuery.selectConfirmedTransactions)),
        tap(([{ transaction }, transactions]) => {
          this.updateTransactionAccount(transaction, transactions);
        })
      );
    },
    { dispatch: false }
  );

  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionActions.update),
      mergeMap(({ old, update }) =>
        this.service.update({ id: old.id, changes: update }).pipe(
          map(
            (transaction) =>
              TransactionActions.updateSuccess({
                old,
                transaction: { id: transaction.id, changes: transaction },
              }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while updating a transaction.';
              console.log(err);
              return of(TransactionActions.updateFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  updateTransactionAccountOnUpdate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TransactionActions.updateSuccess),
        concatLatestFrom(() => this.store.select(transactionsQuery.selectConfirmedTransactions)),
        tap(([{ old, transaction }, transactions]) => {
          if (old.accountFrom?.id !== transaction.changes.accountFrom?.id || old.accountTo?.id !== transaction.changes.accountTo?.id) {
            this.updateTransactionAccount(old, transactions);
          }

          this.updateTransactionAccount(<Transaction>transaction.changes, transactions);
        })
      );
    },
    { dispatch: false }
  );

  remove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionActions.remove),
      concatMap((action) =>
        this.service.delete(action.transaction.id).pipe(
          map(
            () =>
              TransactionActions.removeSuccess({
                transaction: action.transaction,
              }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while removing a transaction.';
              console.log(err);
              return of(TransactionActions.removeFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  removeSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TransactionActions.removeSuccess),
        concatLatestFrom(() => this.store.select(transactionsQuery.selectConfirmedTransactions)),
        tap(([{ transaction }, transactions]) => {
          this.updateTransactionAccount(transaction, transactions);
          this.notify.success('Transaction has been deleted');
        })
      );
    },
    { dispatch: false }
  );

  readonly showErrorAlert$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TransactionActions.retrieveFail, TransactionActions.addFail, TransactionActions.updateFail, TransactionActions.removeFail),
        tap(({ errorMessage }) => this.notify.error(errorMessage))
      );
    },
    { dispatch: false }
  );

  private readonly accountBalanceUpdate = 'Account balance update';

  constructor(private actions$: Actions, private service: TransactionsService, private notify: NotificationService, private store: Store) {}

  private buildAccountBalanceUpdateTransaction(account: Account): Transaction {
    return {
      id: Guid.newGuid(),
      date: new Date().getTime(),
      category: null,
      accountFrom: account.balance < 0 ? account : null,
      accountTo: account.balance > 0 ? account : null,
      currency: account.currency,
      transactionType: account.balance > 0 ? TransactionType.Income : TransactionType.Expense,
      transactionState: TransactionState.Confirmed,
      tags: [],
      includeInReports: false,
      amount: account.balance,
      exchangeRate: 1,
      note: this.accountBalanceUpdate,
    };
  }

  private updateTransactionAccount(transaction: Transaction, transactions: Transaction[]) {
    switch (transaction.transactionType) {
      case TransactionType.Expense:
        {
          const account = transaction.accountFrom!;
          const amount = this.getAccountTotal(transactions, account.id);
          this.store.dispatch(AccountActions.updateAccountBalance({ account, amount }));
        }
        break;

      case TransactionType.Income:
        {
          const account = transaction.accountTo!;
          const amount = this.getAccountTotal(transactions, account.id);
          this.store.dispatch(AccountActions.updateAccountBalance({ account, amount }));
        }
        break;

      case TransactionType.Transfer:
        {
          const accountFrom = transaction.accountFrom!;
          const amountFromSum = this.getAccountTotal(transactions, accountFrom.id);

          const accountTo = transaction.accountTo!;
          const amountToSum = this.getAccountTotal(transactions, accountTo.id);

          forkJoin([
            this.store.dispatch(
              AccountActions.updateAccountBalance({
                account: accountFrom,
                amount: amountFromSum,
              })
            ),
            this.store.dispatch(
              AccountActions.updateAccountBalance({
                account: accountTo,
                amount: amountToSum,
              })
            ),
          ]);
        }
        break;
    }
  }

  private getAccountTotal(transactions: Transaction[], accountId: string) {
    const fromSum = _.sumBy(
        transactions.filter((t) => t.accountFrom?.id === accountId),
        'amount'
      ),
      toSum = _.sumBy(
        transactions.filter((t) => t.accountTo?.id === accountId),
        'amount'
      );

    return round(toSum) - round(fromSum);
  }
}
