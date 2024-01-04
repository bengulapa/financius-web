import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Currency } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent implements OnChanges {
  @Input()
  form!: UntypedFormGroup;

  @Input()
  currencies?: Currency[] | null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currencies?.currentValue && this.currencies?.length && !this.form.get('currency')?.valid) {
      this.setDefaultCurrency();
    }
  }

  setCurrency(code: string | null) {
    this.form.patchValue({
      currency: code ? this.currencies?.find((c) => c.code === code) || null : null,
    });
  }

  private setDefaultCurrency() {
    const defaultCurrency = this.currencies!.find((c) => c.isDefault);

    this.form.patchValue({
      currency: defaultCurrency,
      currencyCode: defaultCurrency?.code,
    });
  }
}
