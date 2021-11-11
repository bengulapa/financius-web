import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { ModelState, SyncState } from 'src/app/shared/models/financius.enums';

@Injectable()
export abstract class EntityBaseService<TEntity> {
  abstract storeName: string;

  constructor(private dbService: NgxIndexedDBService) {}

  add(entity: Partial<TEntity>) {
    return this.dbService.add(this.storeName, {
      ...entity,
      model_state: ModelState.Normal,
      sync_state: SyncState.None,
    });
  }

  update(entity: Partial<TEntity>) {
    return this.dbService.update(this.storeName, {
      ...entity,
      model_state: ModelState.Normal,
      sync_state: SyncState.None,
    });
  }

  delete(key: string | number) {
    return this.dbService.deleteByKey(this.storeName, key);
  }

  getAll(): Observable<TEntity[]> {
    return this.dbService.getAll(this.storeName);
  }

  getById(id: string): Observable<TEntity> {
    return this.dbService.getByID(this.storeName, id);
  }
}
