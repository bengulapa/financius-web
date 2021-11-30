import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumDisplay',
})
export class EnumDisplayPipe implements PipeTransform {
  transform(enumValue: number, enumObject: any): unknown {
    return enumValue ? enumObject[enumValue]?.replace(/([A-Z])/g, ' $1').trim() : '';
  }
}
