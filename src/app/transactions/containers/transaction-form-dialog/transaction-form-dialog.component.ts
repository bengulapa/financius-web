import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { TagsService } from 'src/app/core/services/tags.service';
import { FormHelpers } from 'src/app/core/utilities/form.helpers';
import {
  Account,
  Category,
  Tag,
  Transaction,
} from 'src/app/shared/models/entities.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';

@Component({
  selector: 'app-transaction-form-dialog',
  templateUrl: './transaction-form-dialog.component.html',
  styleUrls: ['./transaction-form-dialog.component.scss'],
})
export class TransactionFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;

  TransactionType = TransactionType;
  accounts$?: Observable<Account[]>;
  categories$?: Observable<Category[]>;
  tags$?: Observable<Tag[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { transaction: Transaction },
    public dialogRef: MatDialogRef<TransactionFormDialogComponent>,
    private formHelpers: FormHelpers,
    private accountsService: AccountsService,
    private categoriesService: CategoriesService,
    private tagsService: TagsService
  ) {
    this.accounts$ = this.accountsService.getAccounts();
    this.categories$ = this.categoriesService.getCategories();
    this.tags$ = this.tagsService.getTags();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.data.transaction;

    const transaction = this.data.transaction;
    this.form = this.formHelpers.createTransactionForm(transaction);
  }

  onAccountSelected(event: {
    account: Account;
    type: TransactionType;
    isFrom?: boolean;
  }) {
    switch (event.type) {
      default:
      case TransactionType.Expense:
        this.form.patchValue({
          accountFrom: event.account,
          accountTo: null,
        });
        break;

      case TransactionType.Income:
        this.form.patchValue({
          accountFrom: null,
          accountTo: event.account,
        });
        break;

      case TransactionType.Transfer:
        this.form.patchValue({
          accountFrom: event.isFrom
            ? event.account
            : this.form.get('accountFrom')?.value,
          accountTo: !event.isFrom
            ? event.account
            : this.form.get('accountTo')?.value,
        });
        break;
    }
  }

  onCategorySelected(category: Category | null) {
    this.form.patchValue({ category });
  }

  onTagsSelected(tags: Tag[]) {
    this.form.patchValue({ tags });
  }

  close() {
    const formValue = { ...this.form.value };
    // remove id fk property
    delete formValue.accountFromId;
    delete formValue.accountToId;
    delete formValue.categoryId;
    delete formValue.tagIds;

    this.dialogRef.close({
      ...formValue,
    });
  }
}
