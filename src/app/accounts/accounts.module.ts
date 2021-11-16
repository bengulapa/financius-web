import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountsTableComponent } from './components/accounts-table/accounts-table.component';
import { AccountViewComponent } from './containers/account-view/account-view.component';
import { AccountsShellComponent } from './containers/accounts-shell/accounts-shell.component';
import { AccountsEffects } from './state/accounts.effects';
import * as fromReducer from './state/accounts.reducer';

@NgModule({
  declarations: [
    AccountsShellComponent,
    AccountsTableComponent,
    AccountViewComponent,
    AccountDetailsComponent,
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
    EffectsModule.forFeature([AccountsEffects]),
  ],
})
export class AccountsModule {}
