import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { storeNames } from 'src/app/core/state/indexed-db-config';
import {
  Account,
  Category,
  Currency,
  Tag,
  Transaction,
} from 'src/app/shared/models/entities.models';
import {
  FinanciusAccount,
  FinanciusBackup,
  FinanciusCategory,
  FinanciusCurrency,
  FinanciusTag,
  FinanciusTransaction,
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

  constructor(
    private dbService: NgxIndexedDBService,
    private notify: NotificationService
  ) {}

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

  onExportClick() {
    forkJoin([
      this.dbService.getAll<{ id: string; version: number; timestamp: number }>(
        storeNames.Metadata
      ),
      this.dbService
        .getAll<Currency>(storeNames.Currencies)
        .pipe(map((c) => this.mapToFinanciusCurrency(c))),
      this.dbService
        .getAll<Category>(storeNames.Categories)
        .pipe(map((c) => this.mapToFinanciusCategory(c))),
      this.dbService
        .getAll<Tag>(storeNames.Tags)
        .pipe(map((t) => this.mapToFinanciusTag(t))),
      this.dbService
        .getAll<Account>(storeNames.Accounts)
        .pipe(map((a) => this.mapToFinanciusAccount(a))),
      this.dbService
        .getAll<Transaction>(storeNames.Transactions)
        .pipe(map((t) => this.mapToFinanciusTransaction(t))),
    ]).subscribe(
      ([metadata, currencies, categories, tags, accounts, transactions]) => {
        const backupMetadata = metadata.find((m) => m.id === 'backup');

        this.downloadJson({
          version: (backupMetadata?.version || 0) + 1,
          timestamp: new Date().getTime(),
          currencies,
          categories,
          tags,
          accounts,
          transactions,
        });
      }
    );
  }

  private startImport(backup: FinanciusBackup) {
    this.loading$.next(true);

    forkJoin([
      this.importAccounts(backup),
      this.importCategories(backup),
      this.importCurrencies(backup),
      this.importTags(backup),
      this.importTransactions(backup),
      this.importMetadata(backup),
    ])
      .pipe(
        switchMap(() => {
          this.loading$.next(false);
          return this.informSuccess(backup);
        })
      )
      .subscribe(() => location.reload());
  }

  private informSuccess(backup: FinanciusBackup) {
    return this.notify
      .info({
        title: 'Backup Restored!',
        content: `<ul class="text-start">
        <li>${backup.accounts.length} accounts</li>
        <li>${backup.transactions.length} transactions</li>
        <li>${backup.categories.length} categories</li>
        <li>${backup.tags.length} tags</li>
        <li>${backup.currencies.length} currencies</li>
      `,
      })
      .afterClosed();
  }

  private importAccounts(backup: FinanciusBackup) {
    return this.dbService.clear(storeNames.Accounts).pipe(
      switchMap(() => {
        return this.dbService.bulkAdd(
          storeNames.Accounts,
          backup.accounts.map(
            (a) =>
              <Account>{
                id: a.id,
                modelState: a.model_state,
                syncState: a.sync_state,
                currency: this.getCurrency(a.currency_code, backup.currencies),
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
    );
  }

  private importCategories(backup: FinanciusBackup) {
    return this.dbService.clear(storeNames.Categories).pipe(
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
    );
  }

  private importCurrencies(backup: FinanciusBackup) {
    return this.dbService.clear(storeNames.Currencies).pipe(
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
    );
  }

  private importTags(backup: FinanciusBackup) {
    return this.dbService.clear(storeNames.Tags).pipe(
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
    );
  }

  private importTransactions(backup: FinanciusBackup) {
    return this.dbService.clear(storeNames.Transactions).pipe(
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
    );
  }

  private importMetadata(backup: FinanciusBackup) {
    return this.dbService.clear(storeNames.Metadata).pipe(
      switchMap(() => {
        return this.dbService.add(storeNames.Metadata, {
          id: 'backup',
          version: backup.version,
          timestamp: backup.timestamp,
        });
      })
    );
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

  private convertToFinanciusAmount(
    value: number,
    decimalCount: number
  ): number {
    if (!decimalCount) {
      return 0;
    }

    return value * Math.pow(10, decimalCount);
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

  private mapToFinanciusTransaction(t: Transaction[]): FinanciusTransaction[] {
    return t.map(
      (tr) =>
        <FinanciusTransaction>{
          id: tr.id,
          model_state: tr.modelState,
          sync_state: tr.syncState,
          account_from_id: tr.accountFrom?.id || null,
          account_to_id: tr.accountTo?.id || null,
          category_id: tr.category?.id || null,
          tag_ids: tr.tags?.map((t) => t.id),
          date: tr.date,
          amount: this.convertToFinanciusAmount(
            tr.amount,
            tr.currency?.decimalCount!
          ),
          exchange_rate: tr.exchangeRate,
          note: tr.note,
          transaction_state: tr.transactionState,
          transaction_type: tr.transactionType,
          include_in_reports: tr.includeInReports,
        }
    );
  }

  private mapToFinanciusTag(t: Tag[]): FinanciusTag[] {
    return t.map(
      (tag) =>
        <FinanciusTag>{
          id: tag.id,
          model_state: tag.modelState,
          sync_state: tag.syncState,
          title: tag.name,
        }
    );
  }

  private mapToFinanciusCategory(c: Category[]): FinanciusCategory[] {
    return c.map(
      (fc) =>
        <FinanciusCategory>{
          id: fc.id,
          model_state: fc.modelState,
          sync_state: fc.syncState,
          title: fc.name,
          color: fc.color,
          transaction_type: fc.transactionType,
          sort_order: fc.sortOrder,
        }
    );
  }

  private mapToFinanciusCurrency(c: Currency[]): FinanciusCurrency[] {
    return c.map(
      (fc) =>
        <FinanciusCurrency>{
          id: fc.id,
          model_state: fc.modelState,
          sync_state: fc.syncState,
          code: fc.code,
          symbol: fc.symbol,
          symbol_position: fc.symbolPosition,
          decimal_separator: fc.decimalSeparator,
          group_separator: fc.groupSeparator,
          decimal_count: fc.decimalCount,
        }
    );
  }

  private mapToFinanciusAccount(a: Account[]): FinanciusAccount[] {
    return a.map(
      (ac) =>
        <FinanciusAccount>{
          id: ac.id,
          model_state: ac.modelState,
          sync_state: ac.syncState,
          currency_code: ac.currency.code,
          title: ac.name,
          note: ac.note,
          balance: this.convertToFinanciusAmount(
            ac.balance,
            ac.currency.decimalCount
          ),
          include_in_totals: ac.includeInTotals,
        }
    );
  }

  private downloadJson(backup: FinanciusBackup) {
    var sJson = JSON.stringify(backup);
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson)
    );
    element.setAttribute(
      'download',
      `Financius ${formatDate(backup.timestamp, 'yyyy-MM-dd Hmmss', 'en')}.json`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }
}
