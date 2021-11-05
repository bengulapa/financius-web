import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TransactionsShellComponent } from './containers/transactions-shell/transactions-shell.component';

@NgModule({
  declarations: [TransactionsShellComponent],
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
