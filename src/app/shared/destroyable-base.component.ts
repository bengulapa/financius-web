import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class DestroyableBaseComponent implements OnDestroy {
  protected ngUnsubscribe$ = new Subject();

  /**
   * https://stackoverflow.com/a/41177163
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
