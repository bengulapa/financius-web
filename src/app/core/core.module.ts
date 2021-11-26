import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment';
import { AccountsEffects } from '../accounts/state/accounts.effects';
import { CurrenciesEffects } from '../currencies/state/currencies.effects';
import { SharedModule } from '../shared/shared.module';
import { TransactionsEffects } from '../transactions/state/transactions.effects';
import { metaReducers, reducers } from './state/core.reducers';
import { entityConfig } from './state/entity-metadata';
import { EntityStoreModule } from './state/entity-store.module';
import { dbConfig } from './state/indexed-db-config';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    HttpClientModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([
      AccountsEffects,
      TransactionsEffects,
      CurrenciesEffects,
    ]),
    EntityDataModule.forRoot(entityConfig),
    EntityStoreModule,
  ],
})
export class CoreModule {}
