import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { BaseEntityState } from 'src/app/core/state/core.reducers';
import { Transaction } from 'src/app/shared/models/entities.models';
import {
  SelectedPeriod,
  TransactionFilter,
} from 'src/app/shared/models/view.models';
import { TransactionActions } from './transactions.actions';

export const featureKey = 'transactions';

export interface TransactionsState extends BaseEntityState<Transaction> {
  filter: TransactionFilter;
}

export const transactionsAdapter: EntityAdapter<Transaction> =
  createEntityAdapter<Transaction>();

export const initialState: TransactionsState =
  transactionsAdapter.getInitialState({
    loading: false,
    entitiesLoaded: false,
    filter: {
      selectedPeriod: SelectedPeriod.Monthly,
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
    },
  });

export const transactionsReducer = createReducer(
  initialState,
  on(
    TransactionActions.retrieve,
    (state): TransactionsState => ({
      ...state,
      loading: !state.entitiesLoaded,
    })
  ),
  on(
    TransactionActions.add,
    TransactionActions.update,
    TransactionActions.remove,
    (state): TransactionsState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    TransactionActions.retrieveFail,
    TransactionActions.addFail,
    TransactionActions.updateFail,
    TransactionActions.removeFail,
    (state, { errorMessage }): TransactionsState => ({
      ...state,
      loading: false,
      error: errorMessage,
    })
  ),
  on(TransactionActions.retrieveSuccess, (state, { transactions }) =>
    transactionsAdapter.setAll(transactions, {
      ...state,
      loading: false,
      entitiesLoaded: true,
    })
  ),
  on(TransactionActions.addSuccess, (state, { transaction }) =>
    transactionsAdapter.addOne(transaction, {
      ...state,
      loading: false,
    })
  ),
  on(TransactionActions.updateSuccess, (state, { transaction }) =>
    transactionsAdapter.updateOne(transaction, {
      ...state,
      loading: false,
    })
  ),
  on(TransactionActions.removeSuccess, (state, { transaction }) =>
    transactionsAdapter.removeOne(transaction.id, {
      ...state,
      loading: false,
    })
  ),
  on(
    TransactionActions.updateFilter,
    (state, { filter }): TransactionsState => ({
      ...state,
      filter,
    })
  ),
  on(
    TransactionActions.resetFilter,
    (state): TransactionsState => ({
      ...state,
      filter: {
        selectedPeriod: SelectedPeriod.Monthly,
        selectedMonth: new Date().getMonth(),
        selectedYear: new Date().getFullYear(),
      },
    })
  )
);
