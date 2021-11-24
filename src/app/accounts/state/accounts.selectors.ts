import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { transactionsQuery } from 'src/app/transactions/state/transactions.selectors';
import * as fromReducer from './accounts.reducer';

const { selectAll } = fromReducer.accountsAdapter.getSelectors();

const getState = createFeatureSelector<fromReducer.AccountsState>(
  fromReducer.featureKey
);

const selectAllAccounts = createSelector(getState, selectAll);

export const getAccounts = createSelector(selectAllAccounts, (accounts) =>
  accounts?.filter((t) => t.modelState === ModelState.Normal)
);

export const getAccount = createSelector(
  getState,
  (state) => state.selectedAccount
);

export const getLoading = createSelector(getState, (state) => state.loading);

export const getEntitiesLoaded = createSelector(
  getState,
  (state) => state.entitiesLoaded
);

export const getActiveAccounts = createSelector(selectAllAccounts, (accounts) =>
  _.orderBy(
    accounts?.filter(
      (t) => t.modelState === ModelState.Normal && t.includeInTotals
    ),
    'name'
  )
);

export const getTransactions = createSelector(
  getAccount,
  transactionsQuery.getTransactions,
  (account, transactions) => {
    return account && transactions?.length
      ? transactions.filter(
          (t) =>
            t.accountFrom?.id === account.id || t.accountTo?.id === account.id
        )
      : [];
  }
);
