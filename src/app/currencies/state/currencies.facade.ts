import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Currency, Transaction } from 'src/app/shared/models/entities.models';
import { CurrencyActions } from './currencies.actions';
import { CurrenciesState } from './currencies.reducer';
import * as currenciesQuery from './currencies.selectors';

@Injectable({ providedIn: 'root' })
export class CurrenciesFacade {
  loading$? = this.store.select(currenciesQuery.getLoading);
  entities$? = this.store.select(currenciesQuery.getCurrencies);
  currency$?: Observable<Currency | null> = this.store.select(
    currenciesQuery.getCurrency
  );

  constructor(private store: Store<CurrenciesState>) {}

  retrieve() {
    this.store.dispatch(CurrencyActions.retrieve());
  }

  getByKey(key: string) {
    this.store.dispatch(CurrencyActions.getByKey({ key }));
  }

  add(currency: Currency) {
    this.store.dispatch(CurrencyActions.add({ currency }));
  }

  update(currency: Currency) {
    this.store.dispatch(CurrencyActions.update({ currency }));
  }

  updateCurrencyBalance(currency: Currency, amount: number) {
    this.store.dispatch(
      CurrencyActions.updateCurrencyBalance({ currency, amount })
    );
  }

  delete(currency: Currency) {
    this.store.dispatch(CurrencyActions.remove({ currency }));
  }
}
