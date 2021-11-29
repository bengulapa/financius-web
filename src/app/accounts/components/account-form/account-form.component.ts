import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from 'src/app/shared/models/entities.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent implements OnInit {
  @Input()
  form!: FormGroup;

  @Input()
  currencies?: Currency[] | null;

  ngOnInit(): void {
    if (!this.form.get('currency')?.valid) {
      this.setCurrency(environment.defaultCurrency);
    }
  }

  setCurrency(code: string | null) {
    this.form.patchValue({
      currency: code
        ? this.currencies?.find((c) => c.code === code) || null
        : null,
    });
  }
}
