import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { MaterialModule } from './material.module';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';

@NgModule({
  declarations: [MainToolbarComponent, CustomCurrencyPipe],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    CommonModule,
    MaterialModule,
    CustomCurrencyPipe,
    MainToolbarComponent,
  ],
})
export class SharedModule {}
