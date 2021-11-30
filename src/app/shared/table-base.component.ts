import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Directive()
export abstract class TableBaseComponent<T> implements OnChanges {
  @Input()
  data: T[] | null = [];

  @Output()
  edit = new EventEmitter<T>();

  @Output()
  delete = new EventEmitter<T>();

  dataSource!: MatTableDataSource<T>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  abstract displayedColumns: string[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.dataSource = new MatTableDataSource(this.data || []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applySearch(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
