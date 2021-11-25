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

export enum SelectedPeriod {
  Weekly = 0,
  Monthly = 1,
  Yearly = 2,
}

export interface TransactionFilter {
  selectedPeriod: SelectedPeriod;
  selectedMonth?: number;
  selectedWeek?: number;
  selectedYear?: number;
}
