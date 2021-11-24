import { formatCurrency } from '@angular/common';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { Currency } from 'src/app/shared/models/entities.models';
import { storeNames } from '../state/indexed-db-config';
import { EntityBaseService } from './entity-base.service';

@Injectable({ providedIn: 'root' })
export class CurrenciesService extends EntityBaseService<Currency> {
  readonly name = storeNames.Currencies;

  currencies: Currency[] = [
    {
      id: 'ed71e4f2-9a2e-4f2b-ae32-e9513f2d0f4e',
      modelState: 1,
      syncState: 1,
      code: 'USD',
      symbol: 'US$',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
    {
      id: '3e21b3fb-9557-4f30-9fea-6dd60119809c',
      modelState: 1,
      syncState: 1,
      code: 'PHP',
      symbol: '₱',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
    {
      id: 'e9d1e4b1-b40d-4c91-ab06-794ef8c6f3a2',
      modelState: 1,
      syncState: 1,
      code: 'INR',
      symbol: '₹',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
    {
      id: 'dd9deddc-ead6-400d-822d-ec99f1d4ef3c',
      modelState: 1,
      syncState: 1,
      code: 'JPY',
      symbol: 'JP¥',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 0,
    },
    {
      id: 'ec39e3e1-7a8c-492b-b017-880cc93584e7',
      modelState: 1,
      syncState: 1,
      code: 'RUB',
      symbol: 'RUB',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
    {
      id: '7063fb4f-9674-4185-a230-4816af8191af',
      modelState: 1,
      syncState: 1,
      code: 'EUR',
      symbol: '€',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
    {
      id: 'f3afa29e-787a-4413-a267-df44c4fed953',
      modelState: 1,
      syncState: 1,
      code: 'CNY',
      symbol: 'CN¥',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
    {
      id: '374ab058-3848-466c-9f9e-8d0721d94ec5',
      modelState: 1,
      syncState: 1,
      code: 'GBP',
      symbol: '£',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
    {
      id: '91c6554e-a2db-45c5-8084-06392fc69db9',
      modelState: 1,
      syncState: 1,
      code: 'AUD',
      symbol: '$',
      symbolPosition: 2,
      decimalSeparator: '.',
      groupSeparator: ',',
      decimalCount: 2,
    },
  ];

  constructor(dbService: NgxIndexedDBService) {
    super(dbService);
  }

  getCurrencies(): Observable<Currency[]> {
    return of(_.sortBy(this.currencies, 'code'));
  }

  format(value: number, currencyCode: string | null): string {
    const currency = this.currencies.find((c) => c.code === currencyCode);

    return value && currency
      ? formatCurrency(value, 'en', currency.symbol, currency.code)
      : '0';
  }
}
