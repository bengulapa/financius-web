import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { MaterialModule } from './material.module';
import { ColorHexPipe } from './pipes/color-hex.pipe';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';

@NgModule({
  declarations: [
    MainToolbarComponent,
    TransactionsTableComponent,
    CustomCurrencyPipe,
    ColorHexPipe,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, NgxChartsModule],
  exports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,

    MainToolbarComponent,
    TransactionsTableComponent,

    CustomCurrencyPipe,
    ColorHexPipe,
  ],
})
export class SharedModule {}
