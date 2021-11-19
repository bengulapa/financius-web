import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Account } from 'src/app/shared/models/entities.models';
import { TableBaseComponent } from 'src/app/shared/table-base.component';

@Component({
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsTableComponent
  extends TableBaseComponent<Account>
  implements OnChanges
{
  displayedColumns = [
    'name',
    'currencyCode',
    'balance',
    'note',
    'includeInTotals',
    'actions',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.dataSource = new MatTableDataSource(this.data || []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
