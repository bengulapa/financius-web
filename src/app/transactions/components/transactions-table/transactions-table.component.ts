import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
})
export class TransactionsTableComponent implements OnInit, AfterViewInit {
  @Input()
  data: TransactionsViewModel[] | null = [];

  dataSource!: MatTableDataSource<TransactionsViewModel>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['date', 'category', 'tags', 'note', 'amount', 'account'];
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
