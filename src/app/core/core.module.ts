import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { SharedModule } from '../shared/shared.module';

const dbConfig: DBConfig = {
  name: 'Financius',
  version: 1,
  objectStoresMeta: [
    {
      store: 'tags',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        {
          name: 'model_state',
          keypath: 'model_state',
          options: { unique: false },
        },
        {
          name: 'sync_state',
          keypath: 'sync_state',
          options: { unique: false },
        },
        { name: 'title', keypath: 'title', options: { unique: true } },
      ],
    },
  ],
};

@NgModule({
  declarations: [],
  imports: [SharedModule, NgxIndexedDBModule.forRoot(dbConfig)],
})
export class CoreModule {}
