import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { CategoriesShellComponent } from './containers/categories-shell/categories-shell.component';
import { CategoryFormDialogComponent } from './containers/category-form-dialog/category-form-dialog.component';
import { CategoryViewComponent } from './containers/category-view/category-view.component';

@NgModule({
  declarations: [
    CategoriesShellComponent,
    CategoryViewComponent,
    CategoriesTableComponent,
    CategoryFormDialogComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoriesShellComponent,
        pathMatch: 'full',
      },
      {
        path: ':id',
        component: CategoryViewComponent,
      },
    ]),
  ],
})
export class CategoriesModule {}
