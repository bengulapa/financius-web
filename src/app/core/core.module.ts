import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared/shared.module';
import { entityConfig } from './store/entity-metadata';
import { EntityStoreModule } from './store/entity-store.module';
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
    EntityStoreModule,
  ],
})
export class CoreModule {}
