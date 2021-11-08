import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorHex',
})
export class ColorHexPipe implements PipeTransform {
  transform(value: number | undefined): string {
    return value ? '#' + (value * -1).toString(16) : '';
  }
}
