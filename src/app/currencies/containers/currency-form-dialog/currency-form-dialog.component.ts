import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormHelpers } from 'src/app/core/utilities/form.helpers';
import { Currency } from 'src/app/shared/models/entities.models';
import {
  DecimalSeparator,
  GroupSeparator,
  SymbolPosition,
} from 'src/app/shared/models/financius.enums';

@Component({
  selector: 'app-currency-form-dialog',
  templateUrl: './currency-form-dialog.component.html',
  styleUrls: ['./currency-form-dialog.component.scss'],
})
export class CurrencyFormDialogComponent implements OnInit {
  form!: UntypedFormGroup;
  isEditMode = false;
  SymbolPosition = SymbolPosition;
  DecimalSeparator = DecimalSeparator;
  GroupSeparator = GroupSeparator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { currency: Currency },
    private formHelpers: FormHelpers
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.currency;

    this.form = this.formHelpers.createCurrencyForm(this.data.currency);
  }
}
