import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-accounts-card',
  templateUrl: './accounts-card.component.html',
  styleUrls: ['./accounts-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsCardComponent implements OnInit {
  @Input()
  accounts!: Account[];

  activeAccounts: Account[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activeAccounts = this.accounts.filter((a) => a.includeInTotals);
  }

  onAccountClicked(accountId: string) {
    this.router.navigateByUrl(`/accounts/${accountId}`);
  }
}
