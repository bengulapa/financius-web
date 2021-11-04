import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountsShellComponent } from './containers/accounts-shell/accounts-shell.component';
import { AccountsTableComponent } from './components/accounts-table/accounts-table.component';

@NgModule({
  declarations: [AccountsShellComponent, AccountsTableComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccountsShellComponent,
      },
    ]),
  ],
})
export class AccountsModule {}
