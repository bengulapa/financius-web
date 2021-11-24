import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModelState } from 'src/app/shared/models/financius.enums';
import * as fromReducer from './currencies.reducer';

const { selectAll } = fromReducer.currenciesAdapter.getSelectors();

const selectState = createFeatureSelector<fromReducer.CurrenciesState>(
  fromReducer.featureKey
);

const selectAllCurrencies = createSelector(selectState, selectAll);

export const selectCurrencies = createSelector(
  selectAllCurrencies,
  (currencies) => currencies?.filter((t) => t.modelState === ModelState.Normal)
);

export const selectCurrency = createSelector(
  selectState,
  (state) => state.selectedCurrency
);

export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);

export const selectEntitiesLoaded = createSelector(
  selectState,
  (state) => state.entitiesLoaded
);

export const selectMainCurrency = createSelector(
  selectCurrencies,
  (currencies) => currencies.find((c) => c.isDefault) || null
);
