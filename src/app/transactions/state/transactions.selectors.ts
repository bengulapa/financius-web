import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ModelState,
  TransactionState,
} from 'src/app/shared/models/financius.enums';
import * as fromReducer from './transactions.reducer';

const { selectAll } = fromReducer.transactionsAdapter.getSelectors();

const getState = createFeatureSelector<fromReducer.TransactionsState>(
  fromReducer.featureKey
);

const selectAllTransactions = createSelector(getState, selectAll);

export const transactionsQuery = {
  getLoading: createSelector(getState, (state) => state.loading),
  getEntitiesLoaded: createSelector(getState, (state) => state.entitiesLoaded),
  getActiveTransactions: createSelector(selectAllTransactions, (transactions) =>
    transactions?.filter(
      (t) =>
        t.modelState === ModelState.Normal &&
        t.transactionState === TransactionState.Confirmed
    )
  ),
  getTransactions: selectAllTransactions,
};
