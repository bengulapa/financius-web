import { createReducer, on } from '@ngrx/store';
import { BaseState } from 'src/app/core/state/core.reducers';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionActions } from './transactions.actions';

export const featureKey = 'transactions';

export interface TransactionsState extends BaseState {
  transactions: Transaction[];
}

export const initialState: TransactionsState = {
  loading: false,
  transactions: [],
};

export const transactionsReducer = createReducer(
  initialState,
  on(TransactionActions.retrieve, (state) => ({
    ...state,
    loading: true,
  })),
  on(TransactionActions.retrieveSuccess, (state, { transactions }) => ({
    ...state,
    loading: false,
    transactions,
  }))
);
