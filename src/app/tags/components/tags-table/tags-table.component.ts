import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tag } from 'src/app/shared/models/entities.models';
import { TableBaseComponent } from 'src/app/shared/table-base.component';

@Component({
  selector: 'app-tags-table',
  templateUrl: './tags-table.component.html',
  styleUrls: ['./tags-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsTableComponent
  extends TableBaseComponent<Tag>
  implements OnChanges
{
  displayedColumns = ['name', 'actions'];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data?.currentValue) {
      this.dataSource = new MatTableDataSource(this.data || []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
