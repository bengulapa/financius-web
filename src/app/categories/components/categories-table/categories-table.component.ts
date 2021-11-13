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
import { Category } from 'src/app/shared/models/entities.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesTableComponent implements OnChanges {
  @Input()
  data: Category[] | null = [];

  dataSource!: MatTableDataSource<Category>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['color', 'name', 'transactionType', 'actions'];
  TransactionType = TransactionType;

  constructor() {}

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
