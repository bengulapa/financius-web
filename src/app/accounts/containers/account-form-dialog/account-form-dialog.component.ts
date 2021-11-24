import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CurrenciesService } from 'src/app/core/services/currencies.service';
import { FormHelpers } from 'src/app/core/utilities/form.helpers';
import { Account, Currency } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-account-form-dialog',
  templateUrl: './account-form-dialog.component.html',
  styleUrls: ['./account-form-dialog.component.scss'],
})
export class AccountFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  currencies$?: Observable<Currency[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { account: Account },
    public dialogRef: MatDialogRef<AccountFormDialogComponent>,
    private formHelpers: FormHelpers,
    private cs: CurrenciesService
  ) {}

  ngOnInit(): void {
    this.form = this.formHelpers.createAccountForm(this.data.account);

    this.currencies$ = this.cs.getCurrencies();
  }

  close() {
    const formValue = { ...this.form.value };
    // remove id fk property
    delete formValue.currencyId;

    this.dialogRef.close({
      ...formValue,
    });
  }
}
