import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Account } from 'src/app/shared/models/entities.models';
import { ObservableBaseComponent } from 'src/app/shared/observable-base.component';

@Component({
  selector: 'app-accounts-shell',
  templateUrl: './accounts-shell.component.html',
  styleUrls: ['./accounts-shell.component.scss'],
})
export class AccountsShellComponent
  extends ObservableBaseComponent
  implements OnInit
{
  accounts$?: Observable<Account[]>;

  constructor(private service: AccountsService) {
    super();
  }

  ngOnInit(): void {
    this.service.getAll();
    this.accounts$ = this.service.entities$;
  }
}
