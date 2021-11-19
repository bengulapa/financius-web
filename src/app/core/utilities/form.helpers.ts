import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Account,
  Category,
  Currency,
  Tag,
  Transaction,
} from 'src/app/shared/models/entities.models';
import {
  TransactionState,
  TransactionType,
} from 'src/app/shared/models/financius.enums';

@Injectable({ providedIn: 'root' })
export class FormHelpers {
  constructor(private fb: FormBuilder) {}

  createAccountForm(account: Account | null): FormGroup {
    return this.fb.group({
      id: account?.id || '',
      name: [account?.name || '', Validators.required],
      currencyCode: [account?.currency.code || '', Validators.required],
      currency: this.createCurrencyForm(account?.currency),
      note: account?.note || '',
      balance: [account?.balance || 0, Validators.required],
      includeInTotals: account?.includeInTotals || false,
    });
  }

  createCategoryForm(category: Category | null): FormGroup {
    return this.fb.group({
      id: category?.id || '',
      name: [category?.name || '', Validators.required],
      color: [category?.color || '', Validators.required],
      transactionType: [category?.transactionType || '', Validators.required],
    });
  }

  createCurrencyForm(currency?: Currency | null): FormGroup {
    return this.fb.group({
      id: currency?.id || '',
      code: [currency?.code || '', Validators.required],
      symbol: [currency?.symbol || '', Validators.required],
    });
  }

  createTagsForm(tags?: Tag[]): FormArray {
    return this.fb.array(tags?.map((t) => this.createTagForm(t)) || []);
  }

  createTagForm(tag?: Tag): FormGroup {
    return this.fb.group({
      id: tag?.id || '',
      name: [tag?.name || '', Validators.required],
    });
  }

  createTransactionForm(transaction: Transaction): FormGroup {
    const form = this.fb.group({
      id: transaction?.id || '',
      category: transaction?.category,
      categoryId: transaction?.category?.id,
      accountFrom: transaction?.accountFrom,
      accountFromId: transaction?.accountFrom?.id,
      accountTo: transaction?.accountTo,
      accountToId: transaction?.accountTo?.id,
      tags: [transaction?.tags],
      tagIds: [transaction?.tags?.map((t) => t.id)] || [],
      date: transaction?.date ? new Date(transaction?.date) : new Date(),
      amount: transaction?.amount || 0,
      note: transaction?.note || '',
      transactionType: transaction?.transactionType || TransactionType.Expense,
      transactionState:
        transaction?.transactionState === TransactionState.Confirmed || true,
      includeInReports: transaction?.includeInReports || true,
      exchangeRate: transaction?.exchangeRate || 1.0,
    });

    return form;
  }
}
