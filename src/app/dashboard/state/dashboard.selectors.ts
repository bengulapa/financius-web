import { createSelector } from '@ngrx/store';
import * as accountsSelectors from 'src/app/accounts/state/accounts.selectors';
import * as transactionsSelectors from 'src/app/transactions/state/transactions.selectors';

export const selectDashboardPageViewModel = createSelector(
  transactionsSelectors.selectExpenses,
  accountsSelectors.selectActiveAccounts,
  transactionsSelectors.selectPeriodLabel,
  transactionsSelectors.selectLoading,
  accountsSelectors.selectLoading,
  (expenses, accounts, label, transactionsLoading, accountsLoading) => ({
    filteredExpenses: expenses,
    activeAccounts: accounts,
    periodLabel: label,
    loading: transactionsLoading || accountsLoading,
  })
);
