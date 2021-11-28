import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DestroyableBaseComponent } from '../../destroyable-base.component';

@Component({
  selector: 'app-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearchComponent
  extends DestroyableBaseComponent
  implements OnInit
{
  @Output()
  search = new EventEmitter<string>();

  input = new FormControl();

  ngOnInit(): void {
    this.input.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((event) => this.search.emit(event));
  }
}
