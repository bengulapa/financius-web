import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { MaterialModule } from './material.module';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { EnumArrayPipe } from './pipes/enum-array.pipe';

@NgModule({
  declarations: [
    MainToolbarComponent,
    TransactionsTableComponent,
    CustomCurrencyPipe,
    EnumArrayPipe,
    CustomDialogComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, NgxChartsModule],
  exports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    ReactiveFormsModule,

    MainToolbarComponent,
    TransactionsTableComponent,

    CustomCurrencyPipe,
    EnumArrayPipe,
  ],
})
export class SharedModule {}
