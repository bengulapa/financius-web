import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent implements OnChanges {
  @Input()
  form!: FormGroup;

  @Input()
  currencies?: Currency[] | null;

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  setCurrency(code: string | null) {
    this.form.patchValue({
      currency: code
        ? this.currencies?.find((c) => c.code === code) || null
        : null,
    });
  }
}
