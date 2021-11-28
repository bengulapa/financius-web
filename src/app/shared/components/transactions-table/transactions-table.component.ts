import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { getMonth, getYear } from 'date-fns';
import * as _ from 'lodash';
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
export class TransactionsTableComponent
  extends TableBaseComponent<Transaction>
  implements OnInit, OnChanges
{
  @Input()
  loading?: boolean | null = false;

  @Input()
  displayedColumns = [
    'date',
    'category',
    'tags',
    'note',
    'amount',
    'account',
    'actions',
  ];

  TransactionType = TransactionType;

  filterValues!: TransactionsTableFilter;
  years: number[] = [];

  ngOnInit(): void {
    this.filterValues = {
      freeText: '',
      selectedMonth: null,
      selectedYear: null,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.data?.currentValue) {
      this.years = _.uniq(this.data?.map((t) => getYear(t.date))).sort();
    }
  }

  onYearChange(year: number | undefined) {
    this.dataSource.filterPredicate = this.createFilter();
    this.filterValues.selectedYear = year || null;

    this.setFilter();
  }

  onMonthChange(month: number | undefined) {
    this.dataSource.filterPredicate = this.createFilter();
    this.filterValues.selectedMonth =
      month !== undefined && month >= 0 ? month : null;

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

  private createFilter(): (
    transaction: Transaction,
    filter: string
  ) => boolean {
    return function (transaction: Transaction, filter: string): boolean {
      let searchTerms: TransactionsTableFilter = JSON.parse(filter);

      const yearFilter =
        searchTerms.selectedYear !== null
          ? getYear(transaction.date) === searchTerms.selectedYear
          : true;

      const monthFilter =
        searchTerms.selectedMonth !== null
          ? getMonth(transaction.date) === searchTerms.selectedMonth
          : true;

      const freeTextFilter = searchTerms.freeText
        ? transaction.note
            .trim()
            .toLocaleLowerCase()
            .includes(searchTerms.freeText)
        : true;

      return yearFilter && monthFilter && freeTextFilter;
    };
  }
}
