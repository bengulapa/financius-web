import { FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth } from '@angular/common';

export function getLocaleMonthName(month: number) {
  return getLocaleMonthNames('en', FormStyle.Format, TranslationWidth.Wide)[month];
}

export function getLocaleShortDayName(day: number) {
  return getLocaleDayNames('en', FormStyle.Format, TranslationWidth.Abbreviated)[day];
}
