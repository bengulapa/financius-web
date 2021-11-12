import {
  ModelState,
  SyncState,
  TransactionState,
  TransactionType,
} from './financius.enums';

export interface BaseModel {
  id: string;
  modelState?: ModelState;
  syncState?: SyncState;
}

export interface Currency extends BaseModel {
  code: string;
  symbol: string;
  symbolPosition: number;
  decimalSeparator: string;
  groupSeparator: string;
  decimalCount: number;
}

export interface Category extends BaseModel {
  name: string;
  color: number;
  transactionType: TransactionType;
  sortOrder: number;
}

export interface Tag extends BaseModel {
  name: string;
}

export interface Account extends BaseModel {
  currency: Currency;
  name: string;
  note: string;
  balance: number;
  includeInTotals: boolean;
}

export interface Transaction extends BaseModel {
  accountFrom?: Account;
  accountTo?: Account;
  category: Category;
  tags: Tag[];
  date: number;
  amount: number;
  exchangeRate: number;
  note: string;
  transactionState: TransactionState;
  transactionType: TransactionType;
  includeInReports: boolean;
}

export interface Backup {
  version: number;
  timestamp: number;
  currencies: Currency[];
  categories: Category[];
  tags: Tag[];
  accounts: Account[];
  transactions: Transaction[];
}
