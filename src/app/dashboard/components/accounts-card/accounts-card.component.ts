import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Account } from 'src/app/shared/models/financius.models';

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
  inactiveAccounts: Account[] = [];

  constructor() {}

  ngOnInit(): void {
    this.activeAccounts = this.accounts.filter((a) => a.include_in_totals);

    this.inactiveAccounts = this.accounts.filter((a) => !a.include_in_totals);
  }
}
