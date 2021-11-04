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
