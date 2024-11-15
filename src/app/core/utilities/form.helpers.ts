import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Account, Category, Currency, Tag, Transaction } from 'src/app/shared/models/entities.models';
import { SymbolPosition, TransactionState, TransactionType } from 'src/app/shared/models/financius.enums';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FormHelpers {
  constructor(private fb: UntypedFormBuilder) {}

  createAccountForm(account: Account | null): UntypedFormGroup {
    return this.fb.group({
      id: account?.id || '',
      name: [account?.name || '', Validators.required],
      currencyCode: [account?.currency.code || '', Validators.required],
      currency: this.createCurrencyForm(account?.currency),
      note: account?.note || '',
      balance: [account?.balance || 0, Validators.required],
      includeInTotals: account ? account.includeInTotals : true,
    });
  }

  createCategoryForm(category: Category | null): UntypedFormGroup {
    return this.fb.group({
      id: category?.id || '',
      name: [category?.name || '', Validators.required],
      color: [category?.color || '', Validators.required],
      transactionType: [category?.transactionType || TransactionType.Expense, Validators.required],
    });
  }

  createCurrencyForm(currency?: Currency | null): UntypedFormGroup {
    return this.fb.group({
      id: currency?.id || '',
      code: [currency?.code || '', [Validators.required, Validators.maxLength(3)]],
      symbol: [currency?.symbol || '', [Validators.required, Validators.maxLength(3)]],
      symbolPosition: [currency?.symbolPosition || SymbolPosition.FarRight, [Validators.required]],
      decimalCount: [currency?.decimalCount === undefined ? 2 : currency?.decimalCount || 0, [Validators.maxLength(1)]],
      decimalSeparator: [currency?.decimalSeparator === undefined ? '.' : currency?.decimalSeparator, [Validators.maxLength(1)]],
      groupSeparator: [currency?.groupSeparator === undefined ? ',' : currency?.groupSeparator, [Validators.maxLength(1)]],
      isDefault: [currency?.isDefault || false],
    });
  }

  createTagsForm(tags?: Tag[]): UntypedFormArray {
    return this.fb.array(tags?.map((t) => this.createTagForm(t)) || []);
  }

  createTagForm(tag?: Tag): UntypedFormGroup {
    return this.fb.group({
      id: tag?.id || '',
      name: [tag?.name || '', Validators.required],
    });
  }

  createTransactionForm(transaction: Transaction): UntypedFormGroup {
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
      transactionState: transaction?.transactionState === TransactionState.Confirmed || true,
      includeInReports: transaction?.includeInReports || true,
      exchangeRate: transaction?.exchangeRate || 1.0,
    });

    return form;
  }
}
