import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { EntityBaseComponent } from 'src/app/shared/entity-base.component';
import { Account, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss'],
})
export class AccountViewComponent
  extends EntityBaseComponent<Account>
  implements OnInit
{
  transactions$!: Observable<Transaction[]>;
  account$!: Observable<Account | null>;

  constructor(
    private service: AccountsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.router.navigateByUrl('/404');
        return;
      }

      this.account$ = this.service.getByKey(id);
      this.transactions$ = this.service.getTransactions(id);
      this.loading$ = this.service.loading$;
    });
  }
}
