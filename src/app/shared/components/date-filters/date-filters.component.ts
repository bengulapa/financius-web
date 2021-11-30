import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import * as _ from 'lodash';
import { getLocaleMonthName } from 'src/app/core/utilities/date.utils';

@Component({
  selector: 'app-date-filters',
  templateUrl: './date-filters.component.html',
  styleUrls: ['./date-filters.component.scss'],
})
export class DateFiltersComponent implements OnInit {
  @Input()
  appearance: MatFormFieldAppearance = 'standard';

  @Input()
  years!: number[];

  @Input()
  month?: number;

  @Input()
  year?: number;

  @Input()
  yearLabel = 'Filter by year';

  @Input()
  monthLabel = 'Filter by month';

  @Input()
  yearSelectorWidth = '110px';

  @Input()
  monthSelectorWidth = '120px';

  @Output()
  monthChange = new EventEmitter<number | undefined>();

  @Output()
  yearChange = new EventEmitter<number | undefined>();

  @Output()
  clearFilters = new EventEmitter();

  months!: KeyValue<number, string>[];

  constructor() {}

  ngOnInit(): void {
    this.years = this.years || _.range(2010, new Date().getFullYear());

    this.months = _.range(0, 12).map((i) => ({
      key: i,
      value: getLocaleMonthName(i),
    }));
  }
}
