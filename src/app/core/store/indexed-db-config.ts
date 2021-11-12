import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
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
