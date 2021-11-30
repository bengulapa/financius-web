import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { format, getMonth, getYear } from 'date-fns';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { Transaction } from '../../models/entities.models';
import { TransactionsTableFilter } from '../../models/view.models';
import { TableBaseComponent } from '../../table-base.component';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent extends TableBaseComponent<Transaction> {
  @Input()
  loading?: boolean | null = false;

  @Input()
  years?: number[];

  @Input()
  displayedColumns = ['date', 'category', 'tags', 'note', 'amount', 'account', 'actions'];

  TransactionType = TransactionType;

  filterValues: TransactionsTableFilter = {
    freeText: '',
    selectedMonth: null,
    selectedYear: null,
  };

  onYearChange(year: number | undefined) {
    this.dataSource.filterPredicate = this.createFilter();
    this.filterValues.selectedYear = year || null;

    this.setFilter();
  }

  onMonthChange(month: number | undefined) {
    this.dataSource.filterPredicate = this.createFilter();
    this.filterValues.selectedMonth = month !== undefined && month >= 0 ? month : null;

    this.setFilter();
  }

  onClearDateFilters() {
    this.filterValues.selectedMonth = null;
    this.filterValues.selectedYear = null;

    this.setFilter();
  }

  applySearch(search: string) {
    this.dataSource.filterPredicate = this.createFilter();

    this.filterValues.freeText = search?.trim().toLocaleLowerCase();
    this.setFilter();
  }

  private setFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private createFilter(): (transaction: Transaction, filter: string) => boolean {
    return function (transaction: Transaction, filter: string): boolean {
      let searchTerms: TransactionsTableFilter = JSON.parse(filter);

      const yearFilter = searchTerms.selectedYear !== null ? getYear(transaction.date) === searchTerms.selectedYear : true;

      const monthFilter = searchTerms.selectedMonth !== null ? getMonth(transaction.date) === searchTerms.selectedMonth : true;

      const freeTextFilter = searchTerms.freeText
        ? transaction.note.trim().toLocaleLowerCase().includes(searchTerms.freeText) ||
          transaction.tags
            .map((t) => t.name)
            .join()
            .toLocaleLowerCase()
            .includes(searchTerms.freeText) ||
          transaction.amount.toString().includes(searchTerms.freeText) ||
          (transaction.category?.name || '').toLocaleLowerCase().includes(searchTerms.freeText) ||
          (transaction.accountFrom?.name || '').toLocaleLowerCase().includes(searchTerms.freeText) ||
          (transaction.accountTo?.name || '').toLocaleLowerCase().includes(searchTerms.freeText) ||
          format(transaction.date, 'PPPP').toLocaleLowerCase().includes(searchTerms.freeText)
        : true;

      return yearFilter && monthFilter && freeTextFilter;
    };
  }
}
