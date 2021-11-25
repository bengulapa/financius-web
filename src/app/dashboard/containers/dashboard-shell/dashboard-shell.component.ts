import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
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
}
