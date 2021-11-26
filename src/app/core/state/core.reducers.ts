import { EntityState } from '@ngrx/entity';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  accountsReducer,
  AccountsState,
} from 'src/app/accounts/state/accounts.reducer';
import {
  currenciesReducer,
  CurrenciesState,
} from 'src/app/currencies/state/currencies.reducer';
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
  currencies: CurrenciesState;
}

export const reducers: ActionReducerMap<AppState> = {
  accounts: accountsReducer,
  transactions: transactionsReducer,
  currencies: currenciesReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];
