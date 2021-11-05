import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorHex',
})
export class ColorHexPipe implements PipeTransform {
  transform(value: number): string {
    return value ? '#' + (value * -1).toString(16) : '';
  }
}
