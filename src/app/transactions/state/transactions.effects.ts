import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { TransactionActions } from './transactions.actions';

@Injectable()
export class TransactionsEffects {
  retrieve$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.retrieve),
      mergeMap(() =>
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
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.update),
      mergeMap((action) =>
        this.service
          .update({ id: action.transaction.id, changes: action.transaction })
          .pipe(
            map(
              (transaction) =>
                TransactionActions.updateSuccess({
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
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.remove),
      mergeMap((action) =>
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
    )
  );

  constructor(
    private actions$: Actions,
    private service: TransactionsService,
    private notify: NotificationService
  ) {}
}
