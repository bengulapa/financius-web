import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountViewComponent } from './account-view/account-view.component';
import { AccountsTableComponent } from './components/accounts-table/accounts-table.component';
import { AccountsShellComponent } from './containers/accounts-shell/accounts-shell.component';

@NgModule({
  declarations: [
    AccountsShellComponent,
    AccountsTableComponent,
    AccountViewComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccountsShellComponent,
      },
      {
        path: ':id',
        component: AccountViewComponent,
      },
    ]),
  ],
})
export class AccountsModule {}
