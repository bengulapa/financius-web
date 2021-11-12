import { DBConfig } from 'ngx-indexed-db';

export const storeNames = {
  Accounts: 'accounts',
  Categories: 'categories',
  Currencies: 'currencies',
  Tags: 'tags',
  Transactions: 'transactions',
};

const baseObjectStoreSchema = [
  {
    name: 'modelState',
    keypath: 'modelState',
    options: { unique: false },
  },
  {
    name: 'syncState',
    keypath: 'syncState',
    options: { unique: false },
  },
];

export const dbConfig: DBConfig = {
  name: 'Financius',
  version: 1,
  objectStoresMeta: [
    {
      store: storeNames.Accounts,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        ...baseObjectStoreSchema,
        {
          name: 'currency',
          keypath: 'currency',
          options: { unique: false },
        },
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'note', keypath: 'note', options: { unique: false } },
        { name: 'balance', keypath: 'balance', options: { unique: false } },
        {
          name: 'includeInTotals',
          keypath: 'includeInTotals',
          options: { unique: false },
        },
      ],
    },
    {
      store: storeNames.Categories,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        ...baseObjectStoreSchema,
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'color', keypath: 'color', options: { unique: false } },
        {
          name: 'transactionType',
          keypath: 'transactionType',
          options: { unique: false },
        },
        {
          name: 'sortOrder',
          keypath: 'sortOrder',
          options: { unique: false },
        },
      ],
    },
    {
      store: storeNames.Currencies,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        ...baseObjectStoreSchema,
        { name: 'code', keypath: 'code', options: { unique: false } },
        { name: 'symbol', keypath: 'symbol', options: { unique: false } },
        {
          name: 'symbolPosition',
          keypath: 'symbolPosition',
          options: { unique: false },
        },
        {
          name: 'decimalSeparator',
          keypath: 'decimalSeparator',
          options: { unique: false },
        },
        {
          name: 'groupSeparator',
          keypath: 'groupSeparator',
          options: { unique: false },
        },
        {
          name: 'decimalCount',
          keypath: 'decimalCount',
          options: { unique: false },
        },
      ],
    },
    {
      store: storeNames.Tags,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        ...baseObjectStoreSchema,
        { name: 'name', keypath: 'name', options: { unique: true } },
      ],
    },
    {
      store: storeNames.Transactions,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        ...baseObjectStoreSchema,
        {
          name: 'accountFrom',
          keypath: 'accountFrom',
          options: { unique: false },
        },
        {
          name: 'accountTo',
          keypath: 'accountTo',
          options: { unique: false },
        },
        {
          name: 'currency',
          keypath: 'cacurrencytegory',
          options: { unique: false },
        },
        {
          name: 'category',
          keypath: 'category',
          options: { unique: false },
        },
        { name: 'tags', keypath: 'tags', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'amount', keypath: 'amount', options: { unique: false } },
        {
          name: 'exchangeRate',
          keypath: 'exchangeRate',
          options: { unique: false },
        },
        { name: 'note', keypath: 'note', options: { unique: false } },
        {
          name: 'transactionState',
          keypath: 'transactionState',
          options: { unique: false },
        },
        {
          name: 'transactionType',
          keypath: 'transactionType',
          options: { unique: false },
        },
        {
          name: 'includeInReports',
          keypath: 'includeInReports',
          options: { unique: false },
        },
      ],
    },
  ],
};
