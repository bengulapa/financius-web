import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { BaseEntityState } from 'src/app/core/state/core.reducers';
import { Currency } from 'src/app/shared/models/entities.models';
import { CurrencyActions } from './currencies.actions';

export const featureKey = 'currencies';

export interface CurrenciesState extends BaseEntityState<Currency> {
  selectedCurrency: Currency | null;
}

export const currenciesAdapter: EntityAdapter<Currency> =
  createEntityAdapter<Currency>();

export const initialState: CurrenciesState = currenciesAdapter.getInitialState({
  loading: false,
  entitiesLoaded: false,
  selectedCurrency: null,
});

export const currenciesReducer = createReducer(
  initialState,
  on(CurrencyActions.retrieve, (state) => ({
    ...state,
    loading: !state.entitiesLoaded,
  })),
  on(
    CurrencyActions.getByKey,
    CurrencyActions.add,
    CurrencyActions.update,
    CurrencyActions.remove,
    (state) => ({
      ...state,
      loading: true,
    })
  ),
  on(
    CurrencyActions.retrieveFail,
    CurrencyActions.getByKeyFail,
    CurrencyActions.addFail,
    CurrencyActions.updateFail,
    CurrencyActions.removeFail,
    (state, { errorMessage }) => ({
      ...state,
      loading: false,
      error: errorMessage,
    })
  ),
  on(CurrencyActions.retrieveSuccess, (state, { currencies }) =>
    currenciesAdapter.setAll(currencies, {
      ...state,
      loading: false,
      entitiesLoaded: true,
    })
  ),
  on(CurrencyActions.getByKeySuccess, (state, { currency }) =>
    currenciesAdapter.setOne(currency, {
      ...state,
      selectedCurrency: currency,
      loading: false,
    })
  ),
  on(CurrencyActions.addSuccess, (state, { currency }) =>
    currenciesAdapter.addOne(currency, {
      ...state,
      loading: false,
    })
  ),
  on(CurrencyActions.updateSuccess, (state, { currency }) =>
    currenciesAdapter.updateOne(currency, {
      ...state,
      loading: false,
    })
  ),
  on(CurrencyActions.removeSuccess, (state, { currency }) =>
    currenciesAdapter.removeOne(currency.id, {
      ...state,
      loading: false,
    })
  )
);
