import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent {
  @Input()
  form!: FormGroup;

  @Input()
  currencies?: Currency[] | null;

  setCurrency(code: string | null) {
    this.form.patchValue({
      currency: code
        ? this.currencies?.find((c) => c.code === code) || null
        : null,
    });
  }
}
