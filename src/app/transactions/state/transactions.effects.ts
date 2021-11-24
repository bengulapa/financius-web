import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';
import { AccountsFacade } from 'src/app/accounts/state/accounts.facade';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { TransactionActions } from './transactions.actions';
import * as transactionsQuery from './transactions.selectors';

@Injectable()
export class TransactionsEffects {
  retrieve$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionActions.retrieve),
      // Don't load if we've already loaded.
      concatLatestFrom(() =>
        this.store.select(transactionsQuery.selectEntitiesLoaded)
      ),
      filter(([_, loaded]) => !loaded),
      // Don't handle more than one load request at a time.
      exhaustMap(() =>
        this.service.getAll().pipe(
          map(
            (transactions) =>
              TransactionActions.retrieveSuccess({ transactions }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while retrieving transactions.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(TransactionActions.retrieveFail({ errorMessage }));
            })
          )
        )
      )
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
              const errorMessage =
                'An error occurred while adding a transaction.';
              this.notify.error(errorMessage);
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
        concatLatestFrom(() =>
          this.store.select(transactionsQuery.selectActiveTransactions)
        ),
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
              const errorMessage =
                'An error occurred while updating a transaction.';
              this.notify.error(errorMessage);
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
        concatLatestFrom(() =>
          this.store.select(transactionsQuery.selectActiveTransactions)
        ),
        tap(([{ old, transaction }, transactions]) => {
          if (
            old.accountFrom?.id !== transaction.changes.accountFrom?.id ||
            old.accountTo?.id !== transaction.changes.accountTo?.id
          ) {
            this.updateTransactionAccount(old, transactions);
          }

          this.updateTransactionAccount(
            <Transaction>transaction.changes,
            transactions
          );
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
              const errorMessage =
                'An error occurred while removing a transaction.';
              this.notify.error(errorMessage);
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
        concatLatestFrom(() =>
          this.store.select(transactionsQuery.selectActiveTransactions)
        ),
        tap(([{ transaction }, transactions]) => {
          this.updateTransactionAccount(transaction, transactions);
          this.notify.success('Transaction has been deleted');
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private service: TransactionsService,
    private accountsFacade: AccountsFacade,
    private notify: NotificationService,
    private store: Store
  ) {}

  private updateTransactionAccount(
    transaction: Transaction,
    transactions: Transaction[]
  ) {
    switch (transaction.transactionType) {
      case TransactionType.Expense:
        {
          const account = transaction.accountFrom!;
          const amount = this.getAccountTotal(transactions, account.id);
          this.accountsFacade.updateAccountBalance(account, amount);
        }
        break;

      case TransactionType.Income:
        {
          const account = transaction.accountTo!;
          const amount = this.getAccountTotal(transactions, account.id);
          this.accountsFacade.updateAccountBalance(account, amount);
        }
        break;

      case TransactionType.Transfer:
        {
          const accountFrom = transaction.accountFrom!;
          const amountFromSum = this.getAccountTotal(
            transactions,
            accountFrom.id
          );
          this.accountsFacade.updateAccountBalance(accountFrom, amountFromSum);

          const accountTo = transaction.accountTo!;
          const amountToSum = this.getAccountTotal(transactions, accountTo.id);
          this.accountsFacade.updateAccountBalance(accountTo, amountToSum);
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

    return Math.round(toSum) - Math.round(fromSum);
  }
}
