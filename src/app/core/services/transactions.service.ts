import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  SyncState,
  TransactionState,
  TransactionType,
} from 'src/app/shared/models/financius.enums';
import {
  Category,
  FinanciusBackup,
  Transaction,
} from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';
import * as data from 'src/assets/data.json';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  data: FinanciusBackup = data;

  constructor() {}

  get(): Observable<TransactionsViewModel[]> {
    const tags = this.data.tags;

    return of(
      this.data.transactions
        .filter(
          (t) =>
            t.transaction_state === TransactionState.Confirmed &&
            t.sync_state === SyncState.None
        )
        .map((t) => ({
          date: new Date(t.date),
          category: this.getCategory(t),
          tags: t.tag_ids?.length
            ? tags
                .filter((tag) => t.tag_ids.includes(tag.id))
                .map((tag) => tag.title)
            : [],
          note: t.note,
          amount: t.amount,
          account: this.getAccount(t),
          currencyCode:
            this.data.accounts.find((a) => a.id === t.account_from_id)
              ?.currency_code ||
            this.data.accounts.find((a) => a.id === t.account_to_id)
              ?.currency_code ||
            null,
          transactionType: t.transaction_type,
        }))
    );
  }

  private getCategory(t: Transaction): Category | null {
    const categories = this.data.categories;

    return t.category_id
      ? categories.find((c) => c.id == t.category_id) || null
      : null;
  }

  getAccount(t: Transaction): string {
    const accountFrom = this.data.accounts.find(
      (a) => a.id === t.account_from_id
    );
    const accountTo = this.data.accounts.find((a) => a.id === t.account_to_id);

    if (t.transaction_type === TransactionType.Transfer) {
      return `${accountFrom?.title} -> ${accountTo?.title}`;
    }

    return accountFrom?.title || accountTo?.title || '';
  }
}
