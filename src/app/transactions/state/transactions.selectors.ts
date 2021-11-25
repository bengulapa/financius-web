import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getLocaleMonthName } from 'src/app/core/utilities/date.utils';
import {
  ModelState,
  TransactionState,
  TransactionType,
} from 'src/app/shared/models/financius.enums';
import { SelectedPeriod } from 'src/app/shared/models/view.models';
import * as fromReducer from './transactions.reducer';

const { selectAll } = fromReducer.transactionsAdapter.getSelectors();

const selectState = createFeatureSelector<fromReducer.TransactionsState>(
  fromReducer.featureKey
);

const selectAllTransactions = createSelector(selectState, selectAll);

export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);

export const selectEntitiesLoaded = createSelector(
  selectState,
  (state) => state.entitiesLoaded
);

export const selectConfirmedTransactions = createSelector(
  selectAllTransactions,
  (transactions) =>
    transactions?.filter(
      (t) =>
        t.modelState === ModelState.Normal &&
        t.transactionState === TransactionState.Confirmed
    )
);

export const selectPendingTransactions = createSelector(
  selectAllTransactions,
  (transactions) =>
    transactions?.filter(
      (t) =>
        t.modelState === ModelState.Normal &&
        t.transactionState === TransactionState.Pending
    )
);

export const selectTransactionsForReport = createSelector(
  selectConfirmedTransactions,
  (transactions) => transactions?.filter((t) => t.includeInReports)
);

export const selectFilter = createSelector(
  selectState,
  (state) => state.filter
);

export const selectPeriodLabel = createSelector(selectFilter, (filter) => {
  switch (filter.selectedPeriod) {
    default:
    case SelectedPeriod.Monthly:
      return `${getLocaleMonthName(filter.selectedMonth!)}${
        filter.selectedYear !== new Date().getFullYear()
          ? ` ${filter.selectedYear}`
          : ''
      }`;
  }
});

export const selectExpenses = createSelector(
  selectTransactionsForReport,
  selectFilter,
  (transactions, filter) => {
    let expenses = transactions.filter(
      (t) => t.transactionType === TransactionType.Expense
    );

    if (filter.selectedPeriod === SelectedPeriod.Monthly) {
      expenses = expenses?.filter(
        (t) =>
          new Date(t.date).getMonth() === filter.selectedMonth &&
          new Date(t.date).getFullYear() === filter.selectedYear
      );
    }

    return expenses;
  }
);
