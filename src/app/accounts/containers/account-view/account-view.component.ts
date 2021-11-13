import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Account, Transaction } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss'],
})
export class AccountViewComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  account$!: Observable<Account | null>;

  constructor(
    private service: AccountsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.router.navigateByUrl('/404');
        return;
      }

      this.account$ = this.service.getByKey(id);
      this.transactions$ = this.service.getTransactions(id);
    });
  }
}
