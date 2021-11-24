import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModelState } from 'src/app/shared/models/financius.enums';
import * as fromReducer from './currencies.reducer';

const { selectAll } = fromReducer.currenciesAdapter.getSelectors();

const getState = createFeatureSelector<fromReducer.CurrenciesState>(
  fromReducer.featureKey
);

const selectAllCurrencies = createSelector(getState, selectAll);

export const getCurrencies = createSelector(selectAllCurrencies, (currencies) =>
  currencies?.filter((t) => t.modelState === ModelState.Normal)
);

export const getCurrency = createSelector(
  getState,
  (state) => state.selectedCurrency
);

export const getLoading = createSelector(getState, (state) => state.loading);

export const getEntitiesLoaded = createSelector(
  getState,
  (state) => state.entitiesLoaded
);

export const getMainCurrency = createSelector(
  getCurrencies,
  (currencies) => currencies.find((c) => c.isDefault) || null
);
