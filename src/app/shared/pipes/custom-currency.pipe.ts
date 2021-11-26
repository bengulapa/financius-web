import { Pipe, PipeTransform } from '@angular/core';
import { CurrenciesService } from 'src/app/core/services/currencies.service';
import { Currency } from '../models/entities.models';

@Pipe({
  name: 'fwCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrenciesService) {}

  transform(value: number, currencyCode: Currency | null): string {
    if (!currencyCode) {
      return '0';
    }

    return this.currencyService.format(value, currencyCode);
  }
}
