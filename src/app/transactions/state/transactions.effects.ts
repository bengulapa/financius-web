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

  constructor(
    private actions$: Actions,
    private service: TransactionsService,
    private notify: NotificationService
  ) {}
}
