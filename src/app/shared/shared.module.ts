import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { MaterialModule } from './material.module';
import { ColorHexPipe } from './pipes/color-hex.pipe';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { EnumArrayPipe } from './pipes/enum-array.pipe';

@NgModule({
  declarations: [
    MainToolbarComponent,
    TransactionsTableComponent,
    CustomCurrencyPipe,
    ColorHexPipe,
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
    ColorHexPipe,
    EnumArrayPipe,
  ],
})
export class SharedModule {}
