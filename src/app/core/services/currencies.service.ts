import { formatCurrency } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Currency } from 'src/app/shared/models/entities.models';
import { storeNames } from '../state/indexed-db-config';
import { EntityBaseService } from './entity-base.service';

@Injectable({ providedIn: 'root' })
export class CurrenciesService extends EntityBaseService<Currency> {
  readonly name = storeNames.Currencies;

  constructor(dbService: NgxIndexedDBService) {
    super(dbService);
  }

  format(value: number, currency: Currency | null): string {
    return value && currency
      ? formatCurrency(value, 'en', currency.symbol, currency.code)
      : '0';
  }
}
