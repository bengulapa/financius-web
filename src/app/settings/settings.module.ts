import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsShellComponent } from '../reports/containers/reports-shell/reports-shell.component';
import { SharedModule } from '../shared/shared.module';
import { SettingsShellComponent } from './containers/settings-shell/settings-shell.component';

@NgModule({
  declarations: [SettingsShellComponent],
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
export class SettingsModule {}
