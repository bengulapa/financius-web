import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsFacade } from 'src/app/transactions/state/transactions.facade';
import { AccountsFacade } from '../../state/accounts.facade';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss'],
})
export class AccountViewComponent implements OnInit {
  constructor(
    public facade: AccountsFacade,
    public transactionsFacade: TransactionsFacade,
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

      this.facade.accountViewOpened(id);
    });
  }
}
