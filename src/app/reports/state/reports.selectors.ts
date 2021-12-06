import { createSelector } from '@ngrx/store';
import * as currenciesSelectors from 'src/app/currencies/state/currencies.selectors';
import * as transactionsSelectors from 'src/app/transactions/state/transactions.selectors';

export const selectReportsPageViewModel = createSelector(
  transactionsSelectors.selectExpenses,
  transactionsSelectors.selectFilter,
  transactionsSelectors.selectPeriodLabel,
  transactionsSelectors.selectLoading,
  transactionsSelectors.selectTransactionYears,
  currenciesSelectors.selectMainCurrency,
  (expenses, filter, label, transactionsLoading, transactionYears, mainCurrency) => ({
    filteredExpenses: expenses,
    filter,
    periodLabel: label,
    loading: transactionsLoading,
    transactionYears,
    mainCurrency,
  })
);
