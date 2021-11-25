import { createSelector } from '@ngrx/store';
import * as accountsSelectors from 'src/app/accounts/state/accounts.selectors';
import * as transactionsSelectors from 'src/app/transactions/state/transactions.selectors';

export const selectDashboardPageViewModel = createSelector(
  transactionsSelectors.selectExpenses,
  transactionsSelectors.selectPeriodLabel,
  transactionsSelectors.selectFilter,
  transactionsSelectors.selectLoading,
  accountsSelectors.selectActiveAccounts,
  accountsSelectors.selectLoading,
  (
    expenses,
    label,
    filter,
    transactionsLoading,
    accounts,
    accountsLoading
  ) => ({
    filteredExpenses: expenses,
    activeAccounts: accounts,
    filter,
    periodLabel: label,
    loading: transactionsLoading || accountsLoading,
  })
);
