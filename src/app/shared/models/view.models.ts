import { TransactionType } from './financius.enums';
import { Category } from './financius.models';

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