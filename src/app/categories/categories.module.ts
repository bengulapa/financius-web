import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { CategoriesShellComponent } from './containers/categories-shell/categories-shell.component';

@NgModule({
  declarations: [CategoriesShellComponent, CategoriesTableComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoriesShellComponent,
      },
    ]),
  ],
})
export class CategoriesModule {}
