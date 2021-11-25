import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { SelectedPeriod } from 'src/app/shared/models/view.models';
import { TransactionActions } from 'src/app/transactions/state/transactions.actions';
import { selectFilter } from 'src/app/transactions/state/transactions.selectors';
import { ReportsActions } from '../../state/reports.actions';
import { selectReportsPageViewModel } from '../../state/reports.selectors';

@Component({
  selector: 'app-reports-shell',
  templateUrl: './reports-shell.component.html',
  styleUrls: ['./reports-shell.component.scss'],
})
export class ReportsShellComponent implements OnInit {
  vm$ = this.store.select(selectReportsPageViewModel);
  filter$ = this.store.select(selectFilter);
  selectedMonth!: number;
  selectedYear!: number;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ReportsActions.reportsPageOpened());

    this.filter$.pipe(first()).subscribe((f) => {
      this.selectedMonth = f.selectedMonth!;
      this.selectedYear = f.selectedYear;
    });
  }

  onPeriodChange(increment: number) {
    this.selectedMonth += increment;

    if (this.selectedMonth > 11) {
      this.selectedMonth -= 12;
      this.selectedYear += 1;
    } else if (this.selectedMonth < 0) {
      this.selectedMonth += 12;
      this.selectedYear -= 1;
    }

    this.store.dispatch(
      TransactionActions.updateFilter({
        filter: {
          selectedPeriod: SelectedPeriod.Monthly,
          selectedMonth: this.selectedMonth,
          selectedYear: this.selectedYear,
        },
      })
    );
  }
}
