import { EntityState } from '@ngrx/entity';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  accountsReducer,
  AccountsState,
} from 'src/app/accounts/state/accounts.reducer';
import {
  transactionsReducer,
  TransactionsState,
} from 'src/app/transactions/state/transactions.reducer';

export interface BaseEntityState<T> extends EntityState<T> {
  loading: boolean;
  entitiesLoaded: boolean;
  error?: string;
}

export interface AppState {
  accounts: AccountsState;
  transactions: TransactionsState;
}

export const reducers: ActionReducerMap<AppState> = {
  accounts: accountsReducer,
  transactions: transactionsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];
