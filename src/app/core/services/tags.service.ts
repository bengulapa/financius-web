import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag, Transaction } from 'src/app/shared/models/entities.models';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class TagsService extends EntityCollectionServiceBase<Tag> {
  constructor(
    private transactionsService: TransactionsService,
    factory: EntityCollectionServiceElementsFactory
  ) {
    super('Tag', factory);
  }

  getTags(): Observable<Tag[]> {
    return super
      .getAll()
      .pipe(map((e) => e.filter((t) => t.modelState === ModelState.Normal)));
  }

  getTransactions(tagId: string): Observable<Transaction[]> {
    return this.transactionsService.getByTag(tagId);
  }
}
