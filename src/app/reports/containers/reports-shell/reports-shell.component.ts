import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { add, addWeeks, endOfWeek, startOfWeek } from 'date-fns';
import { first } from 'rxjs/operators';
import { Period } from 'src/app/shared/models/view.models';
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
  selectedPeriod!: Period;
  selectedMonth!: number;
  selectedYear!: number;
  selectedDate!: Date;
  selectedWeek!: {
    start: Date;
    end: Date;
  };

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ReportsActions.reportsPageOpened());

    this.filter$.pipe(first()).subscribe((f) => {
      this.selectedPeriod = f.selectedPeriod;
      this.selectedDate = f.selectedDate;
      this.selectedWeek = f.selectedWeek;
      this.selectedMonth = f.selectedMonth;
      this.selectedYear = f.selectedYear;
    });
  }

  onSelectedPeriodChange(period: Period) {
    this.selectedPeriod = period;

    this.store.dispatch(
      TransactionActions.updateSelectedPeriod({
        period,
      })
    );
  }

  onPeriodChange(increment: number) {
    switch (this.selectedPeriod) {
      default:
      case Period.Month:
        this.selectedMonth += increment;

        if (this.selectedMonth > 11) {
          this.selectedMonth -= 12;
          this.selectedYear += 1;
        } else if (this.selectedMonth < 0) {
          this.selectedMonth += 12;
          this.selectedYear -= 1;
        }
        break;

      case Period.Day:
        this.selectedDate = add(this.selectedDate, {
          days: increment,
        });
        break;

      case Period.Week:
        const weekDate = addWeeks(this.selectedWeek.start, increment);
        this.selectedWeek = {
          start: startOfWeek(weekDate, { weekStartsOn: 1 }),
          end: endOfWeek(weekDate, { weekStartsOn: 1 }),
        };
        break;

      case Period.Year:
        this.selectedYear += increment;
        break;
    }

    this.store.dispatch(
      TransactionActions.updateFilter({
        filter: {
          selectedDate: this.selectedDate,
          selectedWeek: this.selectedWeek,
          selectedPeriod: this.selectedPeriod,
          selectedMonth: this.selectedMonth,
          selectedYear: this.selectedYear,
        },
      })
    );
  }
}
