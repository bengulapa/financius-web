import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { storeNames } from 'src/app/core/store/indexed-db-config';
import {
  Account,
  Category,
  Currency,
  Tag,
  Transaction,
} from 'src/app/shared/models/entities.models';
import {
  FinanciusBackup,
  FinanciusCategory,
  FinanciusCurrency,
  FinanciusTag,
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

    this.importCurrencies(backup);

    this.importTags(backup);

    this.importTransactions(backup);
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
                  currency: this.getCurrency(
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
          ...this.progressLogs$.value,
          `${backup.categories.length} categories imported`,
        ]);
        this.loading$.next(false);
      });
  }

  private importCurrencies(backup: FinanciusBackup) {
    this.loading$.next(true);
    this.progressText$.next(`Importing currencies...`);

    this.dbService
      .clear(storeNames.Currencies)
      .pipe(
        switchMap(() => {
          return this.dbService.bulkAdd(
            storeNames.Currencies,
            backup.currencies.map(
              (c) =>
                <Currency>{
                  id: c.id,
                  modelState: c.model_state,
                  syncState: c.sync_state,
                  code: c.code,
                  symbol: c.symbol,
                  symbolPosition: c.symbol_position,
                  decimalCount: c.decimal_count,
                  decimalSeparator: c.decimal_separator,
                  groupSeparator: c.group_separator,
                }
            )
          );
        })
      )
      .subscribe(() => {
        this.progressText$.next('');
        this.progressLogs$.next([
          ...this.progressLogs$.value,
          `${backup.currencies.length} currencies imported`,
        ]);
        this.loading$.next(false);
      });
  }

  private importTags(backup: FinanciusBackup) {
    this.loading$.next(true);
    this.progressText$.next(`Importing tags...`);

    this.dbService
      .clear(storeNames.Tags)
      .pipe(
        switchMap(() => {
          return this.dbService.bulkAdd(
            storeNames.Tags,
            backup.tags.map(
              (t) =>
                <Tag>{
                  id: t.id,
                  modelState: t.model_state,
                  syncState: t.sync_state,
                  name: t.title,
                }
            )
          );
        })
      )
      .subscribe(() => {
        this.progressText$.next('');
        this.progressLogs$.next([
          ...this.progressLogs$.value,
          `${backup.tags.length} tags imported`,
        ]);
        this.loading$.next(false);
      });
  }

  private importTransactions(backup: FinanciusBackup) {
    this.loading$.next(true);
    this.progressText$.next(`Importing transactions...`);

    this.dbService
      .clear(storeNames.Transactions)
      .pipe(
        switchMap(() => {
          return this.dbService.bulkAdd(
            storeNames.Transactions,
            backup.transactions.map((t) => {
              const accountFrom = this.getAccount(t.account_from_id, backup);
              const accountTo = this.getAccount(t.account_to_id, backup);
              const currency = accountFrom?.currency || accountTo?.currency;

              return <Transaction>{
                id: t.id,
                modelState: t.model_state,
                syncState: t.sync_state,
                accountFrom,
                accountTo,
                category: this.getCategory(t.category_id, backup.categories),
                tags: this.getTags(t.tag_ids, backup.tags),
                date: t.date,
                amount: this.convert(
                  t.amount,
                  currency?.code || null,
                  backup.currencies
                ),
                currency,
                exchangeRate: t.exchange_rate,
                note: t.note,
                transactionState: t.transaction_state,
                transactionType: t.transaction_type,
                includeInReports: t.include_in_reports,
              };
            })
          );
        })
      )
      .subscribe(() => {
        this.progressText$.next('');
        this.progressLogs$.next([
          ...this.progressLogs$.value,
          `${backup.transactions.length} transactions imported`,
        ]);
        this.loading$.next(false);
      });
  }

  // Financius exports amount without decimal, this converts it back based on the decimal_count property
  private convert(
    value: number,
    code: string | null,
    currencies: FinanciusCurrency[]
  ): number {
    if (!code) {
      return 0;
    }

    const currency = currencies.find((c) => c.code == code);

    return currency ? value / Math.pow(10, currency.decimal_count) : 0;
  }

  private getAccount(
    accountId: string | null,
    backup: FinanciusBackup
  ): Account | null {
    const account = backup.accounts.find((a) => a.id === accountId);
    return account
      ? <Account>{
          id: account.id,
          modelState: account.model_state,
          syncState: account.sync_state,
          currency: this.getCurrency(account.currency_code, backup.currencies),
          name: account.title,
          note: account.note,
          balance: account.balance,
          includeInTotals: account.include_in_totals,
        }
      : null;
  }

  private getCurrency(
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

  private getCategory(
    categoryId: string | null,
    categories: FinanciusCategory[]
  ): Category | null {
    const category = categories.find((c) => c.id === categoryId);

    return category
      ? <Category>{
          id: category.id,
          modelState: category.model_state,
          syncState: category.sync_state,
          name: category.title,
          color: category.color,
          transactionType: category.transaction_type,
          sortOrder: category.sort_order,
        }
      : null;
  }

  private getTags(tagIds: string[], tags: FinanciusTag[]): Tag[] {
    return tags
      .filter((t) => tagIds.includes(t.id))
      .map(
        (t) =>
          <Tag>{
            id: t.id,
            modelState: t.model_state,
            syncState: t.sync_state,
            name: t.title,
          }
      );
  }
}
