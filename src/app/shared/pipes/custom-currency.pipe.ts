import { Pipe, PipeTransform } from '@angular/core';
import { CurrenciesService } from 'src/app/core/services/currencies.service';

@Pipe({
  name: 'fwCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrenciesService) {}

  transform(value: number, currencyCode: string | null): string {
    if (!value || !currencyCode) {
      return '0';
    }

    return value ? this.currencyService.format(value, currencyCode) : '0';
  }
}
