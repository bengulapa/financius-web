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
import { CurrenciesService } from 'src/app/core/services/currencies.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Currency } from 'src/app/shared/models/entities.models';
import { CurrencyActions } from './currencies.actions';
import { getEntitiesLoaded } from './currencies.selectors';

@Injectable()
export class CurrenciesEffects {
  retrieve$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.retrieve),
      withLatestFrom(this.store.select(getEntitiesLoaded)),
      filter(([_, loaded]) => !loaded),
      exhaustMap(() =>
        this.service.getAll().pipe(
          map(
            (currencies) => CurrencyActions.retrieveSuccess({ currencies }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while retrieving currencies.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.retrieveFail({ errorMessage }));
            })
          )
        )
      )
    )
  );

  getByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.getByKey),
      switchMap((action) => {
        return this.service.getById(action.key).pipe(
          map(
            (currency) => CurrencyActions.getByKeySuccess({ currency }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while retrieving an currency.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.getByKeyFail({ errorMessage }));
            })
          )
        );
      })
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.update),
      switchMap((action) =>
        this.service
          .update({ id: action.currency.id, changes: action.currency })
          .pipe(
            map(
              (currency) =>
                CurrencyActions.updateSuccess({
                  currency: { id: currency.id, changes: currency },
                }),
              catchError((err: any) => {
                const errorMessage =
                  'An error occurred while updating a currency.';
                this.notify.error(errorMessage);
                console.log(err);
                return of(CurrencyActions.updateFail({ errorMessage }));
              })
            )
          )
      )
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.remove),
      switchMap((action) =>
        this.service.delete(action.currency.id).pipe(
          map(
            () =>
              CurrencyActions.removeSuccess({
                currency: action.currency,
              }),
            catchError((err: any) => {
              const errorMessage =
                'An error occurred while removing a currency.';
              this.notify.error(errorMessage);
              console.log(err);
              return of(CurrencyActions.removeFail({ errorMessage }));
            })
          )
        )
      )
    )
  );

  constructor(
    private store: Store<Currency>,
    private actions$: Actions,
    private service: CurrenciesService,
    private notify: NotificationService
  ) {}
}
