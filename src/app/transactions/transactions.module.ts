import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionFormDialogComponent } from './containers/transaction-form-dialog/transaction-form-dialog.component';
import { TransactionsShellComponent } from './containers/transactions-shell/transactions-shell.component';
import { TransactionsEffects } from './state/transactions.effects';
import * as fromTransactions from './state/transactions.reducer';

@NgModule({
  declarations: [
    TransactionsShellComponent,
    TransactionFormDialogComponent,
    TransactionFormComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: TransactionsShellComponent,
      },
    ]),
    StoreModule.forFeature(
      fromTransactions.featureKey,
      fromTransactions.transactionsReducer
    ),
    EffectsModule.forFeature([TransactionsEffects]),
  ],
})
export class TransactionsModule {}
