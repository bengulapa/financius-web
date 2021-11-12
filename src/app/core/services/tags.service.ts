import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
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
    return super.getWithQuery(`modelState=${ModelState.Normal}`);
  }

  getTransactions(tagId: string): Observable<Transaction[]> {
    return this.transactionsService.getByTag(tagId);
  }
}
