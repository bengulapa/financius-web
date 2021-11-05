import {
  ModelState,
  SyncState,
  TransactionState,
  TransactionType,
} from './financius.enums';

export interface BaseModel {
  id: string;
  model_state: ModelState;
  sync_state: SyncState;
}

export interface Currency extends BaseModel {
  code: string;
  symbol: string;
  symbol_position: number;
  decimal_separator: string;
  group_separator: string;
  decimal_count: number;
}

export interface Category extends BaseModel {
  title: string;
  color: number;
  transaction_type: TransactionType;
  sort_order: number;
}

export interface Tag extends BaseModel {
  title: string;
}

export interface Account extends BaseModel {
  currency_code: string;
  title: string;
  note: string;
  balance: number;
  include_in_totals: boolean;
}

export interface Transaction extends BaseModel {
  account_from_id: string | null;
  account_to_id: string | null;
  category_id: string | null;
  tag_ids: string[];
  date: number;
  amount: number;
  exchange_rate: number;
  note: string;
  transaction_state: TransactionState;
  transaction_type: TransactionType;
  include_in_reports: boolean;
}

export interface FinanciusBackup {
  version: number;
  timestamp: number;
  currencies: Currency[];
  categories: Category[];
  tags: Tag[];
  accounts: Account[];
  transactions: Transaction[];
}
