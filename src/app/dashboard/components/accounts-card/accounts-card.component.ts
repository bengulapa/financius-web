import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-accounts-card',
  templateUrl: './accounts-card.component.html',
  styleUrls: ['./accounts-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsCardComponent {
  @Input()
  accounts?: Account[] | null;

  constructor(private router: Router) {}

  onAccountClicked(accountId: string) {
    this.router.navigateByUrl(`/accounts/${accountId}`);
  }
}
