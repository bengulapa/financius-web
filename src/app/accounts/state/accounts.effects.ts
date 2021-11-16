import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Account } from 'src/app/shared/models/entities.models';
import { AccountActions } from './accounts.actions';
import { getEntitiesLoaded } from './accounts.selectors';

@Injectable()
export class AccountsEffects {
  retrieve$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.retrieve),
      withLatestFrom(this.store.select(getEntitiesLoaded)),
      filter((_, loaded) => !loaded),
      exhaustMap(() =>
        this.service.getAll().pipe(
          map(
            (accounts) => AccountActions.retrieveSuccess({ accounts }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while retrieving accounts.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(AccountActions.retrieveFail({ errorMessage }));
            })
          )
        )
      )
    )
  );

  getByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.getByKey),
      switchMap((action) => {
        return this.service.getById(action.key).pipe(
          map(
            (account) => AccountActions.getByKeySuccess({ account }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while retrieving an account.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(AccountActions.getByKeyFail({ errorMessage }));
            })
          )
        );
      })
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.add),
      mergeMap((action) =>
        this.service.add(action.account).pipe(
          map(
            (account) => AccountActions.addSuccess({ account }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while adding a account.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(AccountActions.addFail({ errorMessage }));
            })
          )
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.update),
      switchMap((action) =>
        this.service
          .update({ id: action.account.id, changes: action.account })
          .pipe(
            map(
              (account) =>
                AccountActions.updateSuccess({
                  account: { id: account.id, changes: account },
                }),
              catchError((err: any) => {
                const errorMessage =
                  'An error occurred while updating a account.';
                this.notify.error(errorMessage);
                console.log(err);
                return of(AccountActions.updateFail({ errorMessage }));
              })
            )
          )
      )
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.remove),
      switchMap((action) =>
        this.service.delete(action.account.id).pipe(
          map(
            () =>
              AccountActions.removeSuccess({
                account: action.account,
              }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while removing a account.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(AccountActions.removeFail({ errorMessage }));
            })
          )
        )
      )
    )
  );

  constructor(
    private store: Store<Account>,
    private actions$: Actions,
    private service: AccountsService,
    private notify: NotificationService
  ) {}
}
