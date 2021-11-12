import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { Category } from 'src/app/shared/models/entities.models';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesTableComponent implements OnInit, AfterViewInit {
  @Input()
  data: Category[] | null = [];

  dataSource!: MatTableDataSource<Category>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['color', 'title', 'transactionType', 'actions'];
  TransactionType = TransactionType;
  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data || []);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
