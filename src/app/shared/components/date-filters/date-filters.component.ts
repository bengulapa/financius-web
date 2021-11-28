import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { getLocaleMonthName } from 'src/app/core/utilities/date.utils';

@Component({
  selector: 'app-date-filters',
  templateUrl: './date-filters.component.html',
  styleUrls: ['./date-filters.component.scss'],
})
export class DateFiltersComponent implements OnInit {
  @Input()
  years!: number[];

  @Output()
  monthChange = new EventEmitter<number | undefined>();

  @Output()
  yearChange = new EventEmitter<number | undefined>();

  @Output()
  clearFilters = new EventEmitter();

  months!: KeyValue<number, string>[];

  month?: number;
  year?: number;

  constructor() {}

  ngOnInit(): void {
    this.months = _.range(0, 12).map((i) => ({
      key: i,
      value: getLocaleMonthName(i),
    }));
  }
}
