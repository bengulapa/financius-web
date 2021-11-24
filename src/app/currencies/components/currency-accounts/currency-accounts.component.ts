import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Account } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-currency-accounts',
  templateUrl: './currency-accounts.component.html',
  styleUrls: ['./currency-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyAccountsComponent {
  @Input()
  accounts?: Account[] | null;
}
