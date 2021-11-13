import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Account } from 'src/app/shared/models/entities.models';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';

@Component({
  selector: 'app-accounts-shell',
  templateUrl: './accounts-shell.component.html',
  styleUrls: ['./accounts-shell.component.scss'],
})
export class AccountsShellComponent
  extends EntityBaseComponent<Account>
  implements OnInit
{
  constructor(private service: AccountsService) {
    super();
  }

  ngOnInit(): void {
    this.entities$ = this.service.getAccounts();
    this.loading$ = this.service.loading$;
  }
}
