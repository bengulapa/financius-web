import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { BaseEntityState } from 'src/app/core/state/core.reducers';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionActions } from './transactions.actions';

export const featureKey = 'transactions';

export interface TransactionsState extends BaseEntityState<Transaction> {}

export const transactionsAdapter: EntityAdapter<Transaction> =
  createEntityAdapter<Transaction>();

export const initialState: TransactionsState =
  transactionsAdapter.getInitialState({
    loading: false,
  });

export const transactionsReducer = createReducer(
  initialState,
  on(
    TransactionActions.retrieve,
    TransactionActions.add,
    TransactionActions.update,
    TransactionActions.remove,
    (state) => ({
      ...state,
      loading: true,
    })
  ),
  on(
    TransactionActions.retrieveFail,
    TransactionActions.addFail,
    TransactionActions.updateFail,
    TransactionActions.removeFail,
    (state, { errorMessage }) => ({
      ...state,
      loading: false,
      error: errorMessage,
    })
  ),
  on(TransactionActions.retrieveSuccess, (state, { transactions }) =>
    transactionsAdapter.setAll(transactions, {
      ...state,
      loading: false,
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
  )
);
