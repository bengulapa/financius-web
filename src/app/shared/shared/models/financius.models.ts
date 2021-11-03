export interface BaseModel {
  id: string;
  model_state: number;
  sync_state: number;
}

export interface Currency extends BaseModel {
  code: string;
  symbol: string;
  symbol_position: number;
  decimal_separator: string;
  group_separator: string;
  decimal_count: number;
}

export interface Category {}

export interface Tag {}

export interface Account extends BaseModel {
  currency_code: string;
  title: string;
  note: string;
  balance: number;
  include_in_totals: boolean;
}

export interface Transaction {}

export interface FinanciusBackup {
  version: number;
  timestamp: number;
  currencies: Currency[];
  categories: Category[];
  tags: Tag[];
  accounts: Account[];
  transactions: Transaction[];
}
