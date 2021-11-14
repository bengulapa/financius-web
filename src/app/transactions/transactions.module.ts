import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionFormDialogComponent } from './containers/transaction-form-dialog/transaction-form-dialog.component';
import { TransactionsShellComponent } from './containers/transactions-shell/transactions-shell.component';

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
  ],
})
export class TransactionsModule {}
