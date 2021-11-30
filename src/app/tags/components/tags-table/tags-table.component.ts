import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tag } from 'src/app/shared/models/entities.models';
import { TableBaseComponent } from 'src/app/shared/table-base.component';

@Component({
  selector: 'app-tags-table',
  templateUrl: './tags-table.component.html',
  styleUrls: ['./tags-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsTableComponent extends TableBaseComponent<Tag> {
  displayedColumns = ['name', 'actions'];
}
