import {
  FormStyle,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-reports-shell',
  templateUrl: './reports-shell.component.html',
  styleUrls: ['./reports-shell.component.scss'],
})
export class ReportsShellComponent implements OnInit {
  transactions$!: Observable<Transaction[]> | null;
  expenses$!: Observable<Transaction[]>;

  title!: string;
  selectedMonth!: number;
  selectedYear!: number;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    const currentDate = new Date(),
      currentMonth = currentDate.getMonth(),
      currentYear = currentDate.getFullYear();

    this.selectedMonth = currentMonth;
    this.selectedYear = currentYear;
    this.setSelectedPeriod();
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
    this.setSelectedPeriod();
  }

  private setSelectedPeriod() {
    this.setTitle();

    this.expenses$ = this.transactionsService.getMonthlyExpenses(
      this.selectedMonth,
      this.selectedYear
    );
  }

  private setTitle() {
    const month = getLocaleMonthNames(
      'en',
      FormStyle.Format,
      TranslationWidth.Wide
    )[this.selectedMonth];

    this.title = `${month} ${this.selectedYear}`;
  }
}
