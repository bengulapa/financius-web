import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { CurrenciesTableComponent } from './components/currencies-table/currencies-table.component';
import { CurrenciesShellComponent } from './containers/currencies-shell/currencies-shell.component';
import { CurrencyFormDialogComponent } from './containers/currency-form-dialog/currency-form-dialog.component';
import { CurrenciesEffects } from './state/currencies.effects';
import * as fromReducer from './state/currencies.reducer';

@NgModule({
  declarations: [
    CurrenciesShellComponent,
    CurrenciesTableComponent,
    CurrencyFormDialogComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CurrenciesShellComponent,
      },
    ]),
    StoreModule.forFeature(
      fromReducer.featureKey,
      fromReducer.currenciesReducer
    ),
    EffectsModule.forFeature([CurrenciesEffects]),
  ],
})
export class CurrenciesModule {}
