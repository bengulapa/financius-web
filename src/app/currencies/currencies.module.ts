import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CurrenciesShellComponent } from './containers/currencies-shell/currencies-shell.component';
import { CurrenciesTableComponent } from './components/currencies-table/currencies-table.component';
import { CurrencyFormDialogComponent } from './containers/currency-form-dialog/currency-form-dialog.component';

@NgModule({
  declarations: [CurrenciesShellComponent, CurrenciesTableComponent, CurrencyFormDialogComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CurrenciesShellComponent,
      },
    ]),
  ],
})
export class CurrenciesModule {}
