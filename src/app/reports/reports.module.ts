import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ReportsShellComponent } from './containers/reports-shell/reports-shell.component';
import { CategoryReportComponent } from './components/category-report/category-report.component';

@NgModule({
  declarations: [ReportsShellComponent, CategoryReportComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReportsShellComponent,
      },
    ]),
  ],
})
export class ReportsModule {}
