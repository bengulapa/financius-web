import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Currency } from 'src/app/shared/models/entities.models';
import { SymbolPosition } from 'src/app/shared/models/financius.enums';
import { TableBaseComponent } from 'src/app/shared/table-base.component';

@Component({
  selector: 'app-currencies-table',
  templateUrl: './currencies-table.component.html',
  styleUrls: ['./currencies-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesTableComponent extends TableBaseComponent<Currency> {
  displayedColumns = [
    'code',
    'symbol',
    'symbolPosition',
    'decimalSeparator',
    'groupSeparator',
    'decimalCount',
    'actions',
  ];

  SymbolPosition = SymbolPosition;
}
