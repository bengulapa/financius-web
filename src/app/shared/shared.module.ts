import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { MaterialModule } from './material.module';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { ColorHexPipe } from './pipes/color-hex.pipe';

@NgModule({
  declarations: [MainToolbarComponent, CustomCurrencyPipe, ColorHexPipe],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    CommonModule,
    MaterialModule,

    MainToolbarComponent,

    CustomCurrencyPipe,
    ColorHexPipe,
  ],
})
export class SharedModule {}
