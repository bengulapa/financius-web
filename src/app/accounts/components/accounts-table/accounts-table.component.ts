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

@Component({
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsTableComponent implements OnChanges {
  @Input()
  data: Account[] | null = [];

  dataSource!: MatTableDataSource<Account>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = [
    'name',
    'currency',
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
