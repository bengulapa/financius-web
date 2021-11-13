import { Directive } from '@angular/core';
import { Observable } from 'rxjs';

@Directive()
export class EntityBaseComponent<TEntity> {
  loading$?: Observable<boolean>;
  entities$?: Observable<TEntity[]>;
}
