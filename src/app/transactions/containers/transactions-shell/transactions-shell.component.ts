import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';

@Component({
  selector: 'app-transactions-shell',
  templateUrl: './transactions-shell.component.html',
  styleUrls: ['./transactions-shell.component.scss'],
})
export class TransactionsShellComponent implements OnInit {
  transactions$!: Observable<TransactionsViewModel[]>;

  constructor(private service: TransactionsService) {}

  ngOnInit(): void {
    this.transactions$ = this.service.getAll();
  }
}
