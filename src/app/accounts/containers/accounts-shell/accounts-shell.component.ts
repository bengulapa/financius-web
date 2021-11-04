import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Account } from 'src/app/shared/models/financius.models';

@Component({
  selector: 'app-accounts-shell',
  templateUrl: './accounts-shell.component.html',
  styleUrls: ['./accounts-shell.component.scss'],
})
export class AccountsShellComponent implements OnInit {
  accounts$!: Observable<Account[]>;

  constructor(private service: AccountsService) {}

  ngOnInit(): void {
    this.accounts$ = this.service.get();
  }
}
