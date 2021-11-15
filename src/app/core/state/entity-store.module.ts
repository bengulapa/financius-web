import { NgModule } from '@angular/core';
import { EntityDataService } from '@ngrx/data';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {
  Account,
  Category,
  Currency,
  Tag,
  Transaction,
} from 'src/app/shared/models/entities.models';
import { EntityBaseService } from '../services/entity-base.service';
import { storeNames } from './indexed-db-config';

@NgModule({
  declarations: [],
  imports: [],
  providers: [EntityBaseService],
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    dbService: NgxIndexedDBService
  ) {
    // Use custom data service to save to IndexedDB
    // Instantiate instead of new once to avoid the issue where the name is overwritten by the last
    const accountsDataServiceDataService = new EntityBaseService<Account>(
      dbService
    );
    accountsDataServiceDataService.name = storeNames.Accounts;

    const categoriesDataService = new EntityBaseService<Category>(dbService);
    categoriesDataService.name = storeNames.Categories;

    const currenciesDataService = new EntityBaseService<Currency>(dbService);
    currenciesDataService.name = storeNames.Currencies;

    const tagsDataService = new EntityBaseService<Tag>(dbService);
    tagsDataService.name = storeNames.Tags;

    entityDataService.registerServices({
      Account: accountsDataServiceDataService,
      Category: categoriesDataService,
      Currency: currenciesDataService,
      Tag: tagsDataService,
    });
  }
}
