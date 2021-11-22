import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorHex',
})
export class ColorHexPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (!value) {
      return '';
    }

    return '#' + (value! & 0x00ffffff).toString(16).padStart(6, '0');
  }
}
