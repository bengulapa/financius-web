import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment';
import {
  Account,
  Category,
  Currency,
  Tag,
  Transaction,
} from '../shared/models/entities.models';
import { SharedModule } from '../shared/shared.module';
import { EntityBaseService } from './services/entity-base.service';
import { entityConfig } from './store/entity-metadata';
import { dbConfig } from './store/indexed-db-config';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    HttpClientModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
  ],
})
export class CoreModule {
  constructor(
    entityDataService: EntityDataService,
    accountsDataServiceDataService: EntityBaseService<Account>,
    categoriesDataService: EntityBaseService<Category>,
    currenciesDataService: EntityBaseService<Currency>,
    tagsDataService: EntityBaseService<Tag>,
    transactionsDataService: EntityBaseService<Transaction>
  ) {
    // Use custom data service to save to IndexedDB
    accountsDataServiceDataService.name = 'accounts';
    entityDataService.registerServices({
      Account: accountsDataServiceDataService,
    });

    categoriesDataService.name = 'categories';
    entityDataService.registerServices({
      Category: categoriesDataService,
    });

    currenciesDataService.name = 'currencies';
    entityDataService.registerServices({
      Currency: currenciesDataService,
    });

    tagsDataService.name = 'tags';
    entityDataService.registerServices({
      Tag: tagsDataService,
    });

    transactionsDataService.name = 'transactions';
    entityDataService.registerServices({
      Transaction: transactionsDataService,
    });
  }
}
