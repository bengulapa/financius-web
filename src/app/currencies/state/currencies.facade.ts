import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Currency } from 'src/app/shared/models/entities.models';
import { CurrencyActions } from './currencies.actions';
import * as currenciesQuery from './currencies.selectors';

@Injectable({ providedIn: 'root' })
export class CurrenciesFacade {
  loading$? = this.store.select(currenciesQuery.selectLoading);
  entities$? = this.store.select(currenciesQuery.selectCurrencies);
  currency$?: Observable<Currency | null> = this.store.select(
    currenciesQuery.selectCurrency
  );
  mainCurrency$?: Observable<Currency | null> = this.store.select(
    currenciesQuery.selectMainCurrency
  );

  constructor(private store: Store) {}

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

  delete(currency: Currency) {
    this.store.dispatch(CurrencyActions.remove({ currency }));
  }
}
