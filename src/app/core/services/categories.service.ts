import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModelState } from 'src/app/shared/models/financius.enums';
import {
  Category,
  FinanciusBackup,
} from 'src/app/shared/models/financius.models';
import { TransactionsViewModel } from 'src/app/shared/models/view.models';
import * as data from 'src/assets/data.json';
import { sortByName } from '../utilities/sort.helpers';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  data: FinanciusBackup = data;
  categories: Category[] = this.data.categories.filter(
    (c) => c.model_state === ModelState.Normal
  );

  constructor(private transactionsService: TransactionsService) {}

  get(categoryId: string): Observable<Category | null> {
    return of(this.categories.find((c) => c.id === categoryId) || null);
  }

  getAll(): Observable<Category[]> {
    return of(
      this.categories.sort((a, b) => {
        return sortByName(a.title, b.title);
      })
    );
  }

  getTransactions(categoryId: string): Observable<TransactionsViewModel[]> {
    return this.transactionsService.getByCategory(categoryId);
  }
}
