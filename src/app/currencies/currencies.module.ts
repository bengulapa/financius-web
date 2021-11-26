import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { CurrenciesTableComponent } from './components/currencies-table/currencies-table.component';
import { CurrencyAccountsComponent } from './components/currency-accounts/currency-accounts.component';
import { CurrenciesShellComponent } from './containers/currencies-shell/currencies-shell.component';
import { CurrencyFormDialogComponent } from './containers/currency-form-dialog/currency-form-dialog.component';
import { CurrencyViewComponent } from './containers/currency-view/currency-view.component';
import { CurrenciesEffects } from './state/currencies.effects';
import * as fromReducer from './state/currencies.reducer';

@NgModule({
  declarations: [
    CurrenciesShellComponent,
    CurrenciesTableComponent,
    CurrencyFormDialogComponent,
    CurrencyViewComponent,
    CurrencyAccountsComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CurrenciesShellComponent,
      },
      {
        path: ':id',
        component: CurrencyViewComponent,
      },
    ]),
    StoreModule.forFeature(
      fromReducer.featureKey,
      fromReducer.currenciesReducer
    ),
  ],
})
export class CurrenciesModule {}
