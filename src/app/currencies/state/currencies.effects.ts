import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { AccountActions } from 'src/app/accounts/state/accounts.actions';
import { CurrenciesService } from 'src/app/core/services/currencies.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DashboardActions } from 'src/app/dashboard/state/dashboard.actions';
import { ReportsActions } from 'src/app/reports/state/reports.actions';
import { Currency } from 'src/app/shared/models/entities.models';
import { CurrencyActions } from './currencies.actions';
import { selectCurrencies, selectEntitiesLoaded } from './currencies.selectors';

@Injectable()
export class CurrenciesEffects {
  retrieve$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.retrieve),
      concatLatestFrom(() => this.store.select(selectEntitiesLoaded)),
      filter(([_, loaded]) => !loaded),
      exhaustMap(() =>
        this.service.getAll().pipe(
          map(
            (currencies) => CurrencyActions.retrieveSuccess({ currencies }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while retrieving currencies.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.retrieveFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  loadCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        CurrencyActions.currenciesPageOpened,
        DashboardActions.dashboardPageOpened,
        ReportsActions.reportsPageOpened,
        AccountActions.accountsPageOpened
      ),
      mergeMap(() => of(CurrencyActions.retrieve()))
    );
  });

  getByKey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.getByKey),
      switchMap((action) => {
        return this.service.getById(action.key).pipe(
          map(
            (currency) => CurrencyActions.getByKeySuccess({ currency }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while retrieving an currency.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.getByKeyFail({ errorMessage }));
            })
          )
        );
      })
    );
  });

  loadCurrency$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.currencyViewOpened),
      mergeMap(({ currencyId }) => of(CurrencyActions.getByKey({ key: currencyId })))
    );
  });

  add$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.add),
      mergeMap((action) =>
        this.service.add(action.currency).pipe(
          map(
            (currency) => CurrencyActions.addSuccess({ currency }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while adding a currency.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.addFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.update),
      concatMap((action) =>
        this.service.update({ id: action.currency.id, changes: action.currency }).pipe(
          map(
            (currency) =>
              CurrencyActions.updateSuccess({
                currency: { id: currency.id, changes: currency },
              }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while updating a currency.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.updateFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  updatePreviousMainOnAdd$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.addSuccess),
      filter((c) => c.currency.isDefault!),
      concatMap(({ currency }) => of(CurrencyActions.updatePreviousMain({ currency })))
    );
  });

  updatePreviousMainOnUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.updateSuccess),
      filter((c) => c.currency.changes.isDefault!),
      concatMap(({ currency }) =>
        of(
          CurrencyActions.updatePreviousMain({
            currency: <Currency>currency.changes,
          })
        )
      )
    );
  });

  updatePreviousMain$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.updatePreviousMain),
      concatLatestFrom(() => this.store.select(selectCurrencies)),
      filter(([_, c]) => !!c.length),
      concatMap(([{ currency }, currencies]) => {
        const prevMain = currencies.find((c) => c.id !== currency.id && c.isDefault)!;

        return this.service
          .update({
            id: prevMain.id,
            changes: {
              ...prevMain,
              isDefault: false,
            },
          })
          .pipe(
            map(
              (currency) =>
                CurrencyActions.updateSuccess({
                  currency: { id: currency.id, changes: currency },
                }),
              catchError((err: any) => {
                const errorMessage = 'An error occurred while updating a currency.';
                this.notify.error(errorMessage);
                console.log(err);
                return of(CurrencyActions.updateFail({ errorMessage }));
              })
            )
          );
      })
    );
  });

  remove$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.remove),
      concatMap((action) =>
        this.service.delete(action.currency.id).pipe(
          map(
            () =>
              CurrencyActions.removeSuccess({
                currency: action.currency,
              }),
            catchError((err: any) => {
              const errorMessage = 'An error occurred while removing a currency.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.removeFail({ errorMessage }));
            })
          )
        )
      )
    );
  });

  constructor(private store: Store, private actions$: Actions, private service: CurrenciesService, private notify: NotificationService) {}
}
