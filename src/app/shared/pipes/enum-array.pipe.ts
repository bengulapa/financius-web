import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumArray',
})
export class EnumArrayPipe implements PipeTransform {
  transform(enumValue: any): any[] {
    return enumValue
      ? Object.keys(enumValue).filter((key) => !isNaN(Number(enumValue[key])))
      : [];
  }
}
