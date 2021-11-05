import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TagsShellComponent } from './containers/tags-shell/tags-shell.component';
import { TagsTableComponent } from './components/tags-table/tags-table.component';
import { TagViewComponent } from './containers/tag-view/tag-view.component';

@NgModule({
  declarations: [TagsShellComponent, TagsTableComponent, TagViewComponent],
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
