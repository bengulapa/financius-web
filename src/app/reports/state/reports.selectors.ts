import { createSelector } from '@ngrx/store';
import * as currenciesSelectors from 'src/app/currencies/state/currencies.selectors';
import * as transactionsSelectors from 'src/app/transactions/state/transactions.selectors';

export const selectReportsPageViewModel = createSelector(
  transactionsSelectors.selectExpenses,
  transactionsSelectors.selectPeriodLabel,
  transactionsSelectors.selectLoading,
  currenciesSelectors.selectMainCurrency,
  (expenses, label, transactionsLoading, mainCurrency) => ({
    filteredExpenses: expenses,
    periodLabel: label,
    loading: transactionsLoading,
    mainCurrency,
  })
);
