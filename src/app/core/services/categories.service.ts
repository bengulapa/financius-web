import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Transaction } from 'src/app/shared/models/entities.models';
import { ModelState } from 'src/app/shared/models/financius.enums';
import { TransactionsService } from './transactions.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends EntityCollectionServiceBase<Category> {
  constructor(
    private transactionsService: TransactionsService,
    factory: EntityCollectionServiceElementsFactory
  ) {
    super('Category', factory);
  }

  getCategories() {
    return super
      .getAll()
      .pipe(map((e) => e.filter((c) => c.modelState === ModelState.Normal)));
  }

  getTransactions(categoryId: string): Observable<Transaction[]> {
    return this.transactionsService.getByCategory(categoryId);
  }
}
