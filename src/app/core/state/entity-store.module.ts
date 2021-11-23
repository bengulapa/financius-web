import { NgModule } from '@angular/core';
import { EntityDataService } from '@ngrx/data';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Category, Currency, Tag } from 'src/app/shared/models/entities.models';
import { EntityBaseDataService } from '../services/entity-base-data.service';
import { storeNames } from './indexed-db-config';

@NgModule({
  declarations: [],
  imports: [],
  providers: [EntityBaseDataService],
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    dbService: NgxIndexedDBService
  ) {
    // Use custom data service to save to IndexedDB
    // Instantiate instead of new once to avoid the issue where the name is overwritten by the last
    const categoriesDataService = new EntityBaseDataService<Category>(
      dbService
    );
    categoriesDataService.name = storeNames.Categories;

    const currenciesDataService = new EntityBaseDataService<Currency>(
      dbService
    );
    currenciesDataService.name = storeNames.Currencies;

    const tagsDataService = new EntityBaseDataService<Tag>(dbService);
    tagsDataService.name = storeNames.Tags;

    entityDataService.registerServices({
      Category: categoriesDataService,
      Currency: currenciesDataService,
      Tag: tagsDataService,
    });
  }
}
