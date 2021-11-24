import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { AccountsTableComponent } from './components/accounts-table/accounts-table.component';
import { AccountFormDialogComponent } from './containers/account-form-dialog/account-form-dialog.component';
import { AccountViewComponent } from './containers/account-view/account-view.component';
import { AccountsShellComponent } from './containers/accounts-shell/accounts-shell.component';
import * as fromReducer from './state/accounts.reducer';

@NgModule({
  declarations: [
    AccountsShellComponent,
    AccountsTableComponent,
    AccountViewComponent,
    AccountDetailsComponent,
    AccountFormDialogComponent,
    AccountFormComponent,
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
    StoreModule.forFeature(fromReducer.featureKey, fromReducer.accountsReducer),
  ],
})
export class AccountsModule {}
