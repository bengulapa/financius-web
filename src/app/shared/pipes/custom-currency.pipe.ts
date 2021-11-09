import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Pipe({
  name: 'fwCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(
    value: number,
    currencyCode: string | null,
    convert = true
  ): string {
    if (!currencyCode) {
      return '0';
    }

    const balance = convert
      ? this.currencyService.convert(value, currencyCode)
      : value;

    return balance ? this.currencyService.format(balance, currencyCode) : '0';
  }
}
