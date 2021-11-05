import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { FinanciusBackup, Tag } from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';
import * as data from 'src/assets/data.json';
import { sortByName } from '../utilities/sort.helpers';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class TagsService {
  data: FinanciusBackup = data;
  tags: Tag[] = this.data.tags.filter(
    (c) => c.model_state === ModelState.Normal
  );

  constructor(private transactionsService: TransactionsService) {}

  get(id: string): Observable<Tag | null> {
    return of(this.tags.find((c) => c.id === id) || null);
  }

  getAll(): Observable<Tag[]> {
    return of(
      this.tags.sort((a, b) => {
        return sortByName(a.title, b.title);
      })
    );
  }

  getTransactions(tagId: string): Observable<TransactionsViewModel[]> {
    return this.transactionsService.getByTag(tagId);
  }
}
