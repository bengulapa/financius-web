import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ModelState,
  TransactionState,
} from 'src/app/shared/models/financius.enums';
import * as fromReducer from './transactions.reducer';

const getState = createFeatureSelector<fromReducer.TransactionsState>(
  fromReducer.featureKey
);

export const transactionsQuery = {
  getLoading: createSelector(getState, (state) => state.loading),
  getActiveTransactions: createSelector(getState, (state) =>
    state.transactions.filter(
      (t) =>
        t.modelState === ModelState.Normal &&
        t.transactionState === TransactionState.Confirmed
    )
  ),
  getTransactions: createSelector(getState, (state) => state.transactions),
};
