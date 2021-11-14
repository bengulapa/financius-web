import {
  FormStyle,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';

export function getLocaleMonthName(month: number) {
  return getLocaleMonthNames('en', FormStyle.Format, TranslationWidth.Wide)[
    month
  ];
}
