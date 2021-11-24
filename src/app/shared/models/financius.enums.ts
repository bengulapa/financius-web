export enum TransactionType {
  Expense = 1,
  Income = 2,
  Transfer = 3,
}

export enum TransactionState {
  Confirmed = 1,
  Pending = 2,
}

export enum SyncState {
  None = 1,
  InProgress = 2,
  Synced = 3,
  LocalChanges = 4,
}

export enum ModelState {
  Normal = 1,
  Deleted = 2,
  DeletedUndo = 3,
}

export enum SymbolPosition {
  CloseRight = 1,
  FarRight = 2,
  CloseLeft = 3,
  FarLeft = 4,
}

export enum DecimalSeparator {
  Dot = '.',
  Comma = ',',
  Space = ' ',
}

export enum GroupSeparator {
  None = '',
  Dot = '.',
  Comma = ',',
  Space = ' ',
}
