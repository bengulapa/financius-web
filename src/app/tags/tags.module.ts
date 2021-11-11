import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TagsTableComponent } from './components/tags-table/tags-table.component';
import { TagFormDialogComponent } from './containers/tag-form-dialog/tag-form-dialog.component';
import { TagViewComponent } from './containers/tag-view/tag-view.component';
import { TagsShellComponent } from './containers/tags-shell/tags-shell.component';

@NgModule({
  declarations: [
    TagsShellComponent,
    TagsTableComponent,
    TagViewComponent,
    TagFormDialogComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: TagsShellComponent,
      },
      {
        path: ':id',
        component: TagViewComponent,
      },
    ]),
  ],
})
export class TagsModule {}
