import { TransactionType } from './financius.enums';
import { Category } from './entities.models';

export interface TransactionsViewModel {
  date: Date;
  category: Category | null;
  tags: string[];
  note: string;
  amount: number;
  account: string;
  currencyCode: string | null;
  transactionType: TransactionType;
}

export enum Period {
  Day = 0,
  Week = 1,
  Month = 2,
  Year = 3,
}

export interface TransactionFilter {
  selectedPeriod: Period;
  selectedDate: Date;
  selectedMonth: number;
  selectedWeek: {
    start: Date;
    end: Date;
  };
  selectedYear: number;
}

export interface TransactionsTableFilter {
  selectedYear: number | null;
  selectedMonth: number | null;
  freeText: string;
  accountFrom: string;
}
