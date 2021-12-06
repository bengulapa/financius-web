import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardShellComponent } from './containers/dashboard-shell/dashboard-shell.component';
import { AccountsCardComponent } from './components/accounts-card/accounts-card.component';
import { OverviewCardComponent } from './components/overview-card/overview-card.component';

@NgModule({
  declarations: [DashboardShellComponent, AccountsCardComponent, OverviewCardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardShellComponent,
      },
    ]),
  ],
})
export class DashboardModule {}
