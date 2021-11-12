import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { storeNames } from 'src/app/core/store/indexed-db-config';
import {
  Account,
  Category,
  Currency,
} from 'src/app/shared/models/entities.models';
import {
  FinanciusBackup,
  FinanciusCurrency,
} from 'src/app/shared/models/financius.models';

@Component({
  selector: 'app-settings-shell',
  templateUrl: './settings-shell.component.html',
  styleUrls: ['./settings-shell.component.scss'],
})
export class SettingsShellComponent implements OnInit {
  fileName?: string;
  requiredFileType!: string;
  loading$ = new BehaviorSubject<boolean>(false);
  progressText$ = new BehaviorSubject<string>('');
  progressLogs$ = new BehaviorSubject<string[]>([]);

  constructor(private dbService: NgxIndexedDBService) {}

  ngOnInit(): void {
    this.requiredFileType = 'application/json';
  }

  onFileSelected(event: any) {
    console.log(event);
    const file: File = event?.target?.files[0];

    if (!file) {
      return;
    }

    this.fileName = file.name;

    this.readFile(file);
  }

  readFile(file: File) {
    var reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const backup = JSON.parse(reader.result.toString()) as FinanciusBackup;
        this.startImport(backup);
      }
    };
    reader.readAsText(file);
  }

  private startImport(backup: FinanciusBackup) {
    this.loading$.next(true);

    this.importAccounts(backup);

    this.importCategories(backup);
  }

  private importAccounts(backup: FinanciusBackup) {
    this.progressText$.next(`Importing accounts...`);

    this.dbService
      .clear(storeNames.Accounts)
      .pipe(
        switchMap(() => {
          return this.dbService.bulkAdd(
            storeNames.Accounts,
            backup.accounts.map(
              (a) =>
                <Account>{
                  id: a.id,
                  modelState: a.model_state,
                  syncState: a.sync_state,
                  currency: this.mapCurrency(
                    a.currency_code,
                    backup.currencies
                  ),
                  name: a.title,
                  note: a.note,
                  balance: this.convert(
                    a.balance,
                    a.currency_code,
                    backup.currencies
                  ),
                  includeInTotals: a.include_in_totals,
                }
            )
          );
        })
      )
      .subscribe(() => {
        this.progressText$.next('');
        this.progressLogs$.next([
          `${backup.accounts.length} accounts imported`,
        ]);
        this.loading$.next(false);
      });
  }

  private importCategories(backup: FinanciusBackup) {
    this.loading$.next(true);
    this.progressText$.next(`Importing categories...`);

    this.dbService
      .clear(storeNames.Categories)
      .pipe(
        switchMap(() => {
          return this.dbService.bulkAdd(
            storeNames.Categories,
            backup.categories.map(
              (a) =>
                <Category>{
                  id: a.id,
                  modelState: a.model_state,
                  syncState: a.sync_state,
                  name: a.title,
                  color: a.color,
                  transactionType: a.transaction_type,
                  sortOrder: a.sort_order,
                }
            )
          );
        })
      )
      .subscribe(() => {
        this.progressText$.next('');
        this.progressLogs$.next([
          `${backup.categories.length} categories imported!`,
          ...this.progressLogs$.value,
        ]);
        this.loading$.next(false);
      });
  }

  // Financius exports amount without decimal, this converts it back based on the decimal_count property
  private convert(
    value: number,
    code: string,
    currencies: FinanciusCurrency[]
  ): number {
    if (!code) {
      return 0;
    }

    const currency = currencies.find((c) => c.code == code);

    return currency ? value / Math.pow(10, currency.decimal_count) : 0;
  }

  private mapCurrency(
    code: string,
    currencies: FinanciusCurrency[]
  ): Currency | null {
    const currency = currencies.find((c) => c.code === code);
    return currency
      ? <Currency>{
          id: currency.id,
          modelState: currency.model_state,
          syncState: currency.sync_state,
          code: currency.code,
          symbol: currency.symbol,
          symbolPosition: currency.symbol_position,
          decimalSeparator: currency.decimal_separator,
          groupSeparator: currency.group_separator,
          decimalCount: currency.decimal_count,
        }
      : null;
  }
}
