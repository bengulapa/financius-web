import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ModelState,
  TransactionState,
} from 'src/app/shared/models/financius.enums';
import * as fromReducer from './transactions.reducer';

const { selectAll } = fromReducer.transactionsAdapter.getSelectors();

const selectState = createFeatureSelector<fromReducer.TransactionsState>(
  fromReducer.featureKey
);

export const selectAllTransactions = createSelector(selectState, selectAll);

export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);

export const selectEntitiesLoaded = createSelector(
  selectState,
  (state) => state.entitiesLoaded
);

export const selectActiveTransactions = createSelector(
  selectAllTransactions,
  (transactions) =>
    transactions?.filter(
      (t) =>
        t.modelState === ModelState.Normal &&
        t.transactionState === TransactionState.Confirmed
    )
);
