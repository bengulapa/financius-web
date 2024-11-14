import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { BaseEntityState } from 'src/app/core/state/core.reducers';
import { Account } from 'src/app/shared/models/entities.models';
import { AccountActions } from './accounts.actions';

export const featureKey = 'accounts';

export interface AccountsState extends BaseEntityState<Account> {
  selectedAccount: Account | null;
}

export const accountsAdapter: EntityAdapter<Account> = createEntityAdapter<Account>();

export const accountsInitialState: AccountsState = accountsAdapter.getInitialState({
  loading: false,
  entitiesLoaded: false,
  selectedAccount: null,
});

export const accountsReducer = createReducer(
  accountsInitialState,
  on(
    AccountActions.retrieve,
    (state): AccountsState => ({
      ...state,
      loading: !state.entitiesLoaded,
    })
  ),
  on(
    AccountActions.getByKey,
    AccountActions.add,
    AccountActions.update,
    AccountActions.updateAccountBalance,
    AccountActions.remove,
    (state): AccountsState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    AccountActions.retrieveFail,
    AccountActions.getByKeyFail,
    AccountActions.addFail,
    AccountActions.updateFail,
    AccountActions.updateAccountBalanceFail,
    AccountActions.removeFail,
    (state, { errorMessage }): AccountsState => ({
      ...state,
      loading: false,
      error: errorMessage,
    })
  ),
  on(AccountActions.retrieveSuccess, (state, { accounts }) =>
    accountsAdapter.setAll(accounts, {
      ...state,
      loading: false,
      entitiesLoaded: true,
    })
  ),
  on(AccountActions.getByKeySuccess, (state, { account }) =>
    accountsAdapter.setOne(account, {
      ...state,
      selectedAccount: account,
      loading: false,
    })
  ),
  on(AccountActions.addSuccess, (state, { account }) =>
    accountsAdapter.addOne(account, {
      ...state,
      loading: false,
    })
  ),
  on(AccountActions.updateSuccess, (state, { update }) =>
    accountsAdapter.updateOne(update, {
      ...state,
      loading: false,
    })
  ),

  on(AccountActions.updateAccountBalanceSuccess, (state, { account }) =>
    accountsAdapter.updateOne(account, {
      ...state,
      loading: false,
    })
  ),
  on(AccountActions.removeSuccess, (state, { account }) =>
    accountsAdapter.removeOne(account.id, {
      ...state,
      loading: false,
    })
  )
);
