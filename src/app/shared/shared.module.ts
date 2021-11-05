import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { MaterialModule } from './material.module';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { ColorHexPipe } from './pipes/color-hex.pipe';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';

@NgModule({
  declarations: [
    MainToolbarComponent,
    TransactionsTableComponent,
    CustomCurrencyPipe,
    ColorHexPipe,
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    CommonModule,
    MaterialModule,

    MainToolbarComponent,
    TransactionsTableComponent,

    CustomCurrencyPipe,
    ColorHexPipe,
  ],
})
export class SharedModule {}
