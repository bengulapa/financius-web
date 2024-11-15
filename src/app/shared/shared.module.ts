import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TrendsReportComponent } from '../shared/components/trends-report/trends-report.component';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { DateFiltersComponent } from './components/date-filters/date-filters.component';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { PeriodSelectorComponent } from './components/period-selector/period-selector.component';
import { TableSearchComponent } from './components/table-search/table-search.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { MaterialModule } from './material.module';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { EnumArrayPipe } from './pipes/enum-array.pipe';
import { EnumDisplayPipe } from './pipes/enum-display.pipe';
import { EnumSeparatorPipe } from './pipes/enum-separator.pipe';

@NgModule({
  declarations: [
    MainToolbarComponent,
    TransactionsTableComponent,
    CustomDialogComponent,
    PeriodSelectorComponent,
    TableSearchComponent,
    DateFiltersComponent,

    CustomCurrencyPipe,
    EnumArrayPipe,
    EnumSeparatorPipe,
    EnumDisplayPipe,
    TrendsReportComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgxChartsModule],
  exports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    ReactiveFormsModule,

    MainToolbarComponent,
    TransactionsTableComponent,
    PeriodSelectorComponent,
    DateFiltersComponent,
    TableSearchComponent,
    TrendsReportComponent,

    CustomCurrencyPipe,
    EnumArrayPipe,
    EnumSeparatorPipe,
    EnumDisplayPipe,
  ],
})
export class SharedModule {}
