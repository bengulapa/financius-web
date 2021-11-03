import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Account } from 'src/app/shared/shared/models/financius.models';

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
    this.activeAccounts = this.accounts
      .filter((a) => a.include_in_totals)
      .sort((a, b) => this.sortByName(a.title, b.title));

    this.inactiveAccounts = this.accounts
      .filter((a) => !a.include_in_totals)
      .sort((a, b) => this.sortByName(a.title, b.title));
  }

  private sortByName(a: string, b: string) {
    var nameA = a.toUpperCase(); // ignore upper and lowercase
    var nameB = b.toUpperCase(); // ignore upper and lowercase

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
}
