import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModelState, SyncState } from 'src/app/shared/models/financius.enums';

@Injectable()
export abstract class EntityBaseService<TEntity> {
  abstract name: string;

  constructor(protected dbService: NgxIndexedDBService) {}

  add(entity: TEntity): Observable<TEntity> {
    const newEntity = {
      ...entity,
      modelState: ModelState.Normal,
      syncState: SyncState.None,
    };

    this.dbService.add(this.name, newEntity).subscribe();

    return of(newEntity);
  }

  update(update: Update<TEntity>): Observable<TEntity> {
    let updatedEntity = this.dbService
      .update(this.name, {
        ...update.changes,
        modelState: ModelState.Normal,
        syncState: SyncState.None,
      } as unknown as TEntity)
      .pipe(
        map((e) => {
          // TODO: Check if this is still needed
          console.log(e);
          // const entityToUpdate = e.find((e) => (e as any).id === update.id);

          return <TEntity>{
            ...e,
            ...update.changes,
          };
        })
      );

    updatedEntity.subscribe();

    return updatedEntity;
  }

  delete(key: string | number) {
    return this.dbService.deleteByKey(this.name, key);
  }

  bulkDelete(keys: string[]) {
    return this.dbService.bulkDelete(this.name, keys);
  }

  getAll(): Observable<TEntity[]> {
    return this.dbService.getAll(this.name);
  }

  getById(id: string): Observable<TEntity> {
    return this.dbService.getByID(this.name, id);
  }
}
