import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ColorService } from 'src/app/core/services/color.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { storeNames } from 'src/app/core/state/indexed-db-config';
import { Guid } from 'src/app/core/utilities/uuid.utils';
import {
  Account,
  Category,
  Currency,
  Tag,
  Transaction,
} from 'src/app/shared/models/entities.models';
import { ModelState } from 'src/app/shared/models/financius.enums';
import {
  FinanciusAccount,
  FinanciusBackup,
  FinanciusCategory,
  FinanciusCurrency,
  FinanciusTag,
  FinanciusTransaction,
} from 'src/app/shared/models/financius.models';
import { environment } from 'src/environments/environment';

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
    private colorService: ColorService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.requiredFileType = 'application/json';
  }

  onFileSelected(event: any, merge = true) {
    const file: File = event?.target?.files[0];

    if (!file) {
      return;
    }

    this.fileName = file.name;

    this.readFile(file, merge);
  }

  onExportClick() {
    forkJoin([
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
    ]).subscribe(([currencies, categories, tags, accounts, transactions]) => {
      this.downloadJson({
        version: environment.version,
        timestamp: new Date().getTime(),
        currencies,
        categories,
        tags,
        accounts,
        transactions,
      });
    });
  }

  private readFile(file: File, merge: boolean) {
    var reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const backup = JSON.parse(reader.result.toString()) as FinanciusBackup;
        this.startImport(backup, merge);
      }
    };
    reader.readAsText(file);
  }

  private startImport(financius: FinanciusBackup, merge: boolean) {
    this.loading$.next(true);

    // TODO: Merge data
    if (!merge) {
      this.clearDatabase();
    }

    // Don't import deleted filed. Financius still exports soft-deleted entities, `ModelState.Deleted` = 2
    const backup: FinanciusBackup = {
      ...financius,
      // Only import distinct currencies, somehow, Financius duplicates currencies on import or export
      currencies: _.uniqBy(
        financius.currencies.filter((c) => c.model_state === ModelState.Normal),
        'code'
      ),
      categories: financius.categories.filter(
        (c) => c.model_state === ModelState.Normal
      ),
      tags: financius.tags.filter((t) => t.model_state === ModelState.Normal),
      accounts: financius.accounts.filter(
        (a) => a.model_state === ModelState.Normal
      ),
      transactions: financius.transactions.filter(
        (t) => t.model_state === ModelState.Normal
      ),
    };

    // Only import those with values to prevent forkJoin from just completing
    const toImports = [];

    if (backup.currencies.length) {
      toImports.push(this.importCurrencies(backup));
    }

    if (backup.categories.length) {
      toImports.push(this.importCategories(backup));
    }

    if (backup.tags.length) {
      toImports.push(this.importTags(backup));
    }

    if (backup.accounts.length) {
      toImports.push(this.importAccounts(backup));
    }

    if (backup.transactions.length) {
      toImports.push(this.importTransactions(backup));
    }

    forkJoin([this.importMetadata(backup), ...toImports])
      .pipe(
        switchMap(() => {
          this.fileName = '';
          this.loading$.next(false);
          return this.informSuccess(backup);
        }),
        catchError(() => {
          this.fileName = '';
          this.loading$.next(false);
          this.clearDatabase();
          this.notify.error(
            'An error occurred while importing. Please try again.'
          );
          return of();
        })
      )
      .subscribe(() => location.reload());
  }

  private clearDatabase() {
    forkJoin([
      this.dbService.clear(storeNames.Metadata),
      this.dbService.clear(storeNames.Accounts),
      this.dbService.clear(storeNames.Categories),
      this.dbService.clear(storeNames.Currencies),
      this.dbService.clear(storeNames.Tags),
      this.dbService.clear(storeNames.Transactions),
    ]).subscribe();
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
  }

  private importCategories(backup: FinanciusBackup) {
    return this.dbService.bulkAdd(
      storeNames.Categories,
      backup.categories.map((a) => this.mapToCategory(a))
    );
  }

  private importCurrencies(backup: FinanciusBackup) {
    // Determine the main currency. Somehow Financius don't export this data. Check which currency is most used among the accounts. If empty, set a new one.
    const mainCurrencyCode = backup.accounts.length
      ? this.getMainCurrencyCode(backup.accounts)
      : 'USD';

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
            isDefault: c.code === mainCurrencyCode,
          }
      )
    );
  }

  private importTags(backup: FinanciusBackup) {
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
  }

  private importTransactions(backup: FinanciusBackup) {
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
  }

  private importMetadata(backup: FinanciusBackup) {
    return this.dbService.add(storeNames.Metadata, {
      id: Guid.newGuid(),
      type: 'backup',
      value: {
        version: backup.version,
        timestamp: backup.timestamp,
      },
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

    return category ? this.mapToCategory(category) : null;
  }

  private mapToCategory(a: FinanciusCategory): Category {
    return <Category>{
      id: a.id,
      modelState: a.model_state,
      syncState: a.sync_state,
      name: a.title,
      color: this.colorService.argbToHex(a.color),
      transactionType: a.transaction_type,
      sortOrder: a.sort_order,
    };
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
          tag_ids: tr.tags?.map((t) => t.id) || [],
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
          color: this.colorService.hexToSignedInt(fc.color),
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
      `Financius Web ${formatDate(
        backup.timestamp,
        'yyyy-MM-dd Hmmss',
        'en'
      )}.json`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }

  private getMainCurrencyCode(accounts: FinanciusAccount[]): string {
    const currencyGroup = _.groupBy(accounts, 'currency_code');
    const currencies = _.orderBy(
      Object.keys(currencyGroup).map((code) => ({
        code,
        sum: currencyGroup[code].length,
      })),
      'sum',
      'desc'
    );

    return currencies[0].code;
  }
}
