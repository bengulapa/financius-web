import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumSeparator',
})
export class EnumSeparatorPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/([A-Z])/g, ' $1').trim() : '';
  }
}
