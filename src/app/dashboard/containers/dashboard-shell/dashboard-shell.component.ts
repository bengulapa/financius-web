import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Period } from 'src/app/shared/models/view.models';
import { TransactionActions } from 'src/app/transactions/state/transactions.actions';
import { DashboardActions } from '../../state/dashboard.actions';
import { selectDashboardPageViewModel } from '../../state/dashboard.selectors';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
})
export class DashboardShellComponent implements OnInit {
  vm$ = this.store.select(selectDashboardPageViewModel);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.dashboardPageOpened());
  }

  onSelectedPeriodChange(period: Period) {
    this.store.dispatch(
      TransactionActions.updateSelectedPeriod({
        period,
      })
    );
  }
}
