import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { FinanciusBackup, Tag } from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';
import * as data from 'src/assets/data.json';
import { sortByName } from '../utilities/sort.helpers';
import { EntityBaseService } from './entity-base.service';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class TagsService extends EntityBaseService<Tag> {
  readonly storeName = 'tags';

  data: FinanciusBackup = data;
  tags: Tag[] = this.data.tags.filter(
    (c) => c.model_state === ModelState.Normal
  );

  constructor(
    private transactionsService: TransactionsService,
    dbService: NgxIndexedDBService
  ) {
    super(dbService);
  }

  getTransactions(tagId: string): Observable<TransactionsViewModel[]> {
    return this.transactionsService.getByTag(tagId);
  }
}
