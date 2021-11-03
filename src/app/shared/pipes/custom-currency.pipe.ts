import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as data from 'src/assets/data.json';
import { FinanciusBackup } from '../shared/models/financius.models';

@Pipe({
  name: 'fwCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, currencyCode: string): string | null {
    const backup: FinanciusBackup = data;
    const currency = backup.currencies.find((c) => c.code == currencyCode);

    if (currency) {
      const balance = value / Math.pow(10, currency.decimal_count);
      return formatCurrency(balance, 'en', currency.symbol);
    } else {
      return null;
    }
  }
}
