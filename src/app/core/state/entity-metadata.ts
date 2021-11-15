import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Account: {},
  Category: {},
  Currency: {},
  Tag: {},
  Transaction: {},
};

const pluralNames = {
  Account: 'Accounts',
  Category: 'Categories',
  Currency: 'Currencies',
  Tag: 'Tags',
  Transaction: 'Transactions',
};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
};
