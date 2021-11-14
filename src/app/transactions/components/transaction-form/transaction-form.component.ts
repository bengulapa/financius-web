import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Account, Category, Tag } from 'src/app/shared/models/entities.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent implements OnChanges {
  @Input()
  form!: FormGroup;

  @Input()
  accounts?: Account[] | null;

  @Input()
  categories?: Category[] | null;

  @Input()
  tags?: Tag[] | null;

  @Output()
  categorySelected = new EventEmitter<Category | null>();

  @Output()
  accountSelected = new EventEmitter<{
    account: Account;
    type: TransactionType;
    isFrom?: boolean;
  }>();

  @Output()
  tagsSelected = new EventEmitter<Tag[]>();

  TransactionType = TransactionType;
  selectedTransactionType!: TransactionType;
  categoryGroups: { name: string; categories: Category[] }[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accounts?.currentValue?.length) {
      this.accounts = _.orderBy(
        this.accounts,
        ['includeInTotals', 'name'],
        ['desc', 'asc']
      );
    }

    if (changes.form?.currentValue) {
      this.selectedTransactionType =
        this.form.get('transactionType')?.value || TransactionType.Expense;
    }

    if (changes.categories?.currentValue?.length) {
      this.onTransactionTypeChange(this.selectedTransactionType);
    }

    if (changes.tags?.currentValue?.length) {
      this.tags = _.orderBy(this.tags, ['name'], ['asc']);
    }
  }

  onTransactionTypeChange(type: TransactionType) {
    this.selectedTransactionType = type;

    const categoryInput = this.form.get('categoryId')!;
    const accountFromInput = this.form.get('accountFromId')!;
    const accountToInput = this.form.get('accountToId')!;

    switch (type) {
      default:
      case TransactionType.Expense:
        this.setCategoryGroups(type);
        categoryInput.setValidators(Validators.required);
        accountFromInput.setValidators(Validators.required);
        accountToInput.setValidators(null);
        break;

      case TransactionType.Income:
        this.setCategoryGroups(type);
        categoryInput.setValidators(Validators.required);
        categoryInput.updateValueAndValidity();
        accountToInput.setValidators(Validators.required);
        accountFromInput.setValidators(null);
        break;

      case TransactionType.Transfer:
        this.setCategory(null);
        categoryInput.setValidators(null);
        categoryInput.updateValueAndValidity();
        accountFromInput.setValidators(Validators.required);
        accountToInput.setValidators(Validators.required);
        break;
    }

    categoryInput.updateValueAndValidity();
    accountFromInput.updateValueAndValidity();
    accountToInput.updateValueAndValidity();
    this.form.markAllAsTouched();
  }

  setCategory(id: string | null) {
    this.categorySelected.emit(
      id ? this.categories?.find((c) => c.id === id) || null : null
    );
  }

  setAccount(id: string, type: TransactionType, isFrom?: boolean) {
    const account = this.accounts?.find((c) => c.id === id)!;
    this.accountSelected.emit({
      account,
      type,
      isFrom,
    });
  }

  setTags(ids: string[]) {
    const tags = this.tags?.filter((t) => ids.includes(t.id));
    this.tagsSelected.emit(tags);
    console.log(this.form);
  }

  private setCategoryGroups(type: TransactionType) {
    const categoriesByType = _.groupBy(this.categories, 'transactionType');

    const keys =
      type === TransactionType.Income
        ? _.reverse(Object.keys(categoriesByType))
        : Object.keys(categoriesByType);

    this.categoryGroups = keys.map((key) => ({
      name: TransactionType[+key],
      categories: _.orderBy(categoriesByType[key], 'sortOrder'),
    }));
  }
}
