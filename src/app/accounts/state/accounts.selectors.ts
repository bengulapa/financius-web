import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { selectConfirmedTransactions } from 'src/app/transactions/state/transactions.selectors';
import * as fromReducer from './accounts.reducer';

const { selectAll } = fromReducer.accountsAdapter.getSelectors();

const selectState = createFeatureSelector<fromReducer.AccountsState>(
  fromReducer.featureKey
);

const selectAllAccounts = createSelector(selectState, selectAll);

export const selectAccounts = createSelector(selectAllAccounts, (accounts) =>
  accounts?.filter((t) => t.modelState === ModelState.Normal)
);

export const selectAccount = createSelector(
  selectState,
  (state) => state.selectedAccount
);

export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);

export const selectEntitiesLoaded = createSelector(
  selectState,
  (state) => state.entitiesLoaded
);

export const selectActiveAccounts = createSelector(
  selectAllAccounts,
  (accounts) =>
    _.orderBy(
      accounts?.filter(
        (t) => t.modelState === ModelState.Normal && t.includeInTotals
      ),
      'name'
    )
);

export const selectAccountTransactions = createSelector(
  selectAccount,
  selectConfirmedTransactions,
  (account, transactions) => {
    return account && transactions?.length
      ? transactions.filter(
          (t) =>
            t.accountFrom?.id === account.id || t.accountTo?.id === account.id
        )
      : [];
  }
);

export const selectAccountsPageViewModel = createSelector(
  selectAccounts,
  selectLoading,
  (accounts, loading) => ({
    accounts,
    loading,
  })
);
