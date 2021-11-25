import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DashboardActions } from 'src/app/dashboard/state/dashboard.actions';
import { AccountActions } from './accounts.actions';
import { selectEntitiesLoaded } from './accounts.selectors';

@Injectable()
export class AccountsEffects {
  retrieve$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.retrieve),
      concatLatestFrom(() => this.store.select(selectEntitiesLoaded)),
      filter(([_, loaded]) => !loaded),
      exhaustMap(() =>
        this.service.getAll().pipe(
          map(
            (accounts) => AccountActions.retrieveSuccess({ accounts }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while retrieving accounts.';
              console.log(err);
              return of(AccountActions.retrieveFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  loadAccounts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.dashboardPageOpened),
      mergeMap(() => of(AccountActions.retrieve()))
    );
  });

  loadAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.accountViewOpened),
      mergeMap(({ accountId }) =>
        of(AccountActions.getByKey({ key: accountId }))
      )
    );
  });

  getByKey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.getByKey),
      switchMap((action) => {
        return this.service.getById(action.key).pipe(
          map(
            (account) => AccountActions.getByKeySuccess({ account }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while retrieving an account.';
              console.log(err);
              return of(AccountActions.getByKeyFail({ errorMessage }));
            })
          )
        );
      })
    );
  });

  add$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.add),
      mergeMap((action) =>
        this.service.add(action.account).pipe(
          map(
            (account) => AccountActions.addSuccess({ account }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while adding a account.';
              console.log(err);
              return of(AccountActions.addFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.update),
      concatMap((action) =>
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
                console.log(err);
                return of(AccountActions.updateFail({ errorMessage }));
              })
            )
          )
      )
    );
  });

  updateFromTransaction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.updateAccountBalance),
      mergeMap((action) => {
        return this.service
          .update({
            id: action.account.id,
            changes: {
              ...action.account!,
              balance: action.amount,
            },
          })
          .pipe(
            map(
              (account) =>
                AccountActions.updateSuccess({
                  account: { id: account.id, changes: account },
                }),
              catchError((err: any) => {
                const errorMessage =
                  'An error occurred while updating a account.';
                console.log(err);
                return of(AccountActions.updateFail({ errorMessage }));
              })
            )
          );
      })
    );
  });

  remove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AccountActions.remove),
      concatMap((action) =>
        this.service.delete(action.account.id).pipe(
          map(
            () =>
              AccountActions.removeSuccess({
                account: action.account,
              }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while removing a account.';
              console.log(err);
              return of(AccountActions.removeFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  readonly showErrorAlert$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          AccountActions.retrieveFail,
          AccountActions.getByKeyFail,
          AccountActions.addFail,
          AccountActions.updateFail,
          AccountActions.removeFail
        ),
        tap(({ errorMessage }) => this.notify.error(errorMessage))
      );
    },
    { dispatch: false }
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private service: AccountsService,
    private notify: NotificationService
  ) {}
}
