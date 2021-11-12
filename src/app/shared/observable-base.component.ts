import { Directive } from '@angular/core';
import { Observable } from 'rxjs';

@Directive()
export class ObservableBaseComponent {
  loading$?: Observable<boolean>;
}
