import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Category } from 'src/app/shared/models/entities.models';
import { TransactionType } from 'src/app/shared/models/financius.enums';
import { TableBaseComponent } from 'src/app/shared/table-base.component';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesTableComponent extends TableBaseComponent<Category> {
  displayedColumns = ['color', 'name', 'transactionType', 'actions'];
  TransactionType = TransactionType;
}
