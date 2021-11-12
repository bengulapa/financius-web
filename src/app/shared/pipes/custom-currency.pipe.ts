import { Pipe, PipeTransform } from '@angular/core';
import { CurrenciesService } from 'src/app/core/services/currency.service';

@Pipe({
  name: 'fwCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrenciesService) {}

  transform(value: number, currencyCode: string | null): string {
    if (!currencyCode) {
      return '0';
    }

    return value ? this.currencyService.format(value, currencyCode) : '0';
  }
}
