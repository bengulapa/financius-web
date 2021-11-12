import { formatCurrency } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Currency } from 'src/app/shared/models/entities.models';

@Injectable({ providedIn: 'root' })
export class CurrenciesService extends EntityCollectionServiceBase<Currency> {
  constructor(factory: EntityCollectionServiceElementsFactory) {
    super('Currency', factory);
  }

  format(value: number, symbol: string | null): string {
    return value && symbol ? formatCurrency(value, 'en', symbol) : '0';
  }
}
