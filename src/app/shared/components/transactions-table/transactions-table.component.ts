import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { Transaction } from '../../models/entities.models';
import { TableBaseComponent } from '../../table-base.component';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent extends TableBaseComponent<Transaction> {
  @Input()
  loading?: boolean | null = false;

  @Input()
  displayedColumns = [
    'date',
    'category',
    'tags',
    'note',
    'amount',
    'account',
    'actions',
  ];

  TransactionType = TransactionType;
}
