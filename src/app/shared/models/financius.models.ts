import {
  ModelState,
  SyncState,
  TransactionState,
  TransactionType,
} from './financius.enums';

export interface FinanciusBaseModel {
  id: string;
  model_state?: ModelState;
  sync_state?: SyncState;
}

export interface FinanciusCurrency extends FinanciusBaseModel {
  code: string;
  symbol: string;
  symbol_position: number;
  decimal_separator: string;
  group_separator: string;
  decimal_count: number;
}

export interface FinanciusCategory extends FinanciusBaseModel {
  title: string;
  color: number;
  transaction_type: TransactionType;
  sort_order: number;
}

export interface FinanciusTag extends FinanciusBaseModel {
  title: string;
}

export interface FinanciusAccount extends FinanciusBaseModel {
  currency_code: string;
  title: string;
  note: string;
  balance: number;
  include_in_totals: boolean;
}

export interface FinanciusTransaction extends FinanciusBaseModel {
  account_from_id: string | null;
  account_to_id: string | null;
  category_id: string | null;
  tag_ids: string[];
  date: string;
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
  currencies: FinanciusCurrency[];
  categories: FinanciusCategory[];
  tags: FinanciusTag[];
  accounts: FinanciusAccount[];
  transactions: FinanciusTransaction[];
}
