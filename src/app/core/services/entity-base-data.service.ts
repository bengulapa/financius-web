import { Injectable } from '@angular/core';
import { EntityCollectionDataService, QueryParams } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModelState, SyncState } from 'src/app/shared/models/financius.enums';

@Injectable()
export class EntityBaseDataService<TEntity> implements EntityCollectionDataService<TEntity> {
  name!: string;

  constructor(private dbService: NgxIndexedDBService) {}

  add(entity: TEntity): Observable<TEntity> {
    this.dbService
      .add(this.name, {
        ...entity,
        modelState: ModelState.Normal,
        syncState: SyncState.None,
      })
      .subscribe();

    return of(entity);
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

          return {
            ...e,
            ...update.changes,
          } as TEntity;
        })
      );

    updatedEntity.subscribe();

    return updatedEntity;
  }

  delete(key: string | number) {
    this.dbService.deleteByKey(this.name, key).subscribe();

    return of(key);
  }

  getAll(): Observable<TEntity[]> {
    return this.dbService.getAll(this.name);
  }

  getById(id: string): Observable<TEntity> {
    return this.dbService.getByID(this.name, id);
  }

  getWithQuery(params: string | QueryParams): Observable<TEntity[]> {
    throw new Error('Method not implemented.');
  }

  upsert(entity: TEntity): Observable<TEntity> {
    throw new Error('Method not implemented.');
  }
}
