import { createSelector } from '@ngrx/store';
import * as transactionsSelectors from 'src/app/transactions/state/transactions.selectors';

export const selectReportsPageViewModel = createSelector(
  transactionsSelectors.selectExpenses,
  transactionsSelectors.selectPeriodLabel,
  transactionsSelectors.selectLoading,
  (expenses, label, transactionsLoading) => ({
    filteredExpenses: expenses,
    periodLabel: label,
    loading: transactionsLoading,
  })
);
