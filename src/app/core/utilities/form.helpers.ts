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
  TransactionType,
  TransactionState,
} from 'src/app/shared/models/financius.enums';

@Injectable({ providedIn: 'root' })
export class FormHelpers {
  constructor(private fb: FormBuilder) {}

  createAccountForm(account?: Account): FormGroup {
    return this.fb.group({
      id: account?.id || '',
      name: [account?.name || '', Validators.required],
      currency: this.createCurrencyForm(account?.currency),
      note: account?.note || '',
      balance: account?.balance || 0,
      includeInTotals: account?.includeInTotals || false,
    });
  }

  createCategoryForm(category: Category): FormGroup {
    return this.fb.group({
      id: category?.id || '',
      name: [category?.name || '', Validators.required],
      color: [category?.color || '', Validators.required],
      transactionType: [category?.transactionType || '', Validators.required],
    });
  }

  createCurrencyForm(currency?: Currency): FormGroup {
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

  createTransactionFormX(transaction: Transaction): FormGroup {
    return this.fb.group({
      id: transaction?.id || '',
      accountFrom: this.createAccountForm(transaction?.accountFrom),
      accountTo: this.createAccountForm(transaction?.accountTo),
      category: this.createCategoryForm(transaction?.category),
      tags: this.createTagsForm(transaction?.tags),
      date: transaction?.date || new Date(),
      amount: transaction?.amount || 0,
      note: transaction?.note || '',
      transactionType: transaction?.transactionType || TransactionType.Expense,
      transactionState:
        transaction?.transactionState === TransactionState.Confirmed,
      includeInReports: transaction?.includeInReports || true,
    });
  }

  createTransactionForm(transaction: Transaction): FormGroup {
    const form = this.fb.group({
      id: transaction?.id || '',
      categoryId: transaction?.category?.id,
      accountFromId: transaction?.accountFrom?.id,
      accountToId: transaction?.accountTo?.id,
      tagIds: [transaction?.tags?.map((t) => t.id)] || [],
      date: transaction?.date ? new Date(transaction?.date) : new Date(),
      amount: transaction?.amount || 0,
      note: transaction?.note || '',
      transactionType: transaction?.transactionType || TransactionType.Expense,
      transactionState:
        transaction?.transactionState === TransactionState.Confirmed,
      includeInReports: transaction?.includeInReports || true,
    });

    return form;
  }
}
