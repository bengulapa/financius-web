import { Component, OnInit } from '@angular/core';
import { AccountsFacade } from '../../state/accounts.facade';

@Component({
  selector: 'app-accounts-shell',
  templateUrl: './accounts-shell.component.html',
  styleUrls: ['./accounts-shell.component.scss'],
})
export class AccountsShellComponent implements OnInit {
  constructor(public facade: AccountsFacade) {}

  ngOnInit(): void {
    this.facade.retrieve();
  }
}
