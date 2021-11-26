import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AccountActions } from '../../state/accounts.actions';
import { selectAccountPageViewModel } from '../../state/accounts.selectors';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss'],
})
export class AccountViewComponent implements OnInit {
  readonly vm$ = this.store.select(selectAccountPageViewModel);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.router.navigateByUrl('/404');
        return;
      }

      this.store.dispatch(AccountActions.accountViewOpened({ accountId: id }));
    });
  }
}
