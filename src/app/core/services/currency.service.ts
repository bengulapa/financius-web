import { formatCurrency } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Currency } from 'src/app/shared/models/entities.models';
import {
  FinanciusBackup,
  FinanciusCurrency,
} from 'src/app/shared/models/financius.models';
import * as data from 'src/assets/data.json';

@Injectable({ providedIn: 'root' })
export class CurrenciesService extends EntityCollectionServiceBase<Currency> {
  data: FinanciusBackup = data;
  currencies: FinanciusCurrency[] = this.data.currencies;

  constructor(factory: EntityCollectionServiceElementsFactory) {
    super('Currency', factory);
  }

  convert(value: number, code: string | null): number {
    if (!code) {
      return 0;
    }

    const currency = this.currencies.find((c) => c.code == code);

    return currency ? value / Math.pow(10, currency.decimal_count) : 0;
  }

  format(value: number, code: string | null): string {
    if (!code) {
      return '0';
    }

    const currency = this.currencies.find((c) => c.code == code);

    return value && currency
      ? formatCurrency(value, 'en', currency.symbol)
      : '0';
  }
}
