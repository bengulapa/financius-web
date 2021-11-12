import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment';
import { Tag } from '../shared/models/financius.models';
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
    tagsDataService: EntityBaseService<Tag>
  ) {
    tagsDataService.name = 'tags';
    entityDataService.registerServices({
      Tag: tagsDataService,
    });
  }
}
