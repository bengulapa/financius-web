import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomCurrencyPipe } from '../pipes/custom-currency.pipe';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [CustomCurrencyPipe],
  imports: [CommonModule, MaterialModule],
  exports: [CommonModule, MaterialModule, CustomCurrencyPipe],
})
export class SharedModule {}
