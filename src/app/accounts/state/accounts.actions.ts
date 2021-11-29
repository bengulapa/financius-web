import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Account } from 'src/app/shared/models/entities.models';

export namespace AccountActions {
  const prefix = '[Accounts]';

  export const accountsPageOpened = createAction(`${prefix} Accounts Page Opened`);

  export const accountViewOpened = createAction(`${prefix} Account View Opened`, props<{ accountId: string }>());

  export const retrieve = createAction(`${prefix} Retrieve`);

  export const retrieveSuccess = createAction(`${prefix} Retrieve Success`, props<{ accounts: Account[] }>());

  export const retrieveFail = createAction(`${prefix} Retrieve Fail`, props<{ errorMessage: string }>());

  export const getByKey = createAction(`${prefix} Retrieve by Key`, props<{ key: string }>());

  export const getByKeySuccess = createAction(`${prefix} Retrieve by Key Success`, props<{ account: Account }>());

  export const getByKeyFail = createAction(`${prefix} Retrieve by Key Fail`, props<{ errorMessage: string }>());

  export const add = createAction(`${prefix} Add`, props<{ account: Account }>());

  export const addSuccess = createAction(`${prefix} Add Success`, props<{ account: Account }>());

  export const addFail = createAction(`${prefix} Add Fail`, props<{ errorMessage: string }>());

  export const update = createAction(`${prefix} Update`, props<{ account: Account }>());

  export const updateAccountBalance = createAction(`[Transaction]-${prefix} Update Balance`, props<{ account: Account; amount: number }>());

  export const updateAccountBalanceSuccess = createAction(
    `[Transaction]-${prefix} Update Balance Success`,
    props<{ account: Update<Account> }>()
  );

  export const updateAccountBalanceFail = createAction(`[Transaction]-${prefix} Update Balance Fail`, props<{ errorMessage: string }>());

  export const updateSuccess = createAction(`${prefix} Update Success`, props<{ account: Update<Account> }>());

  export const updateFail = createAction(`${prefix} Update Fail`, props<{ errorMessage: string }>());

  export const remove = createAction(`${prefix} Remove`, props<{ account: Account }>());

  export const removeSuccess = createAction(`${prefix} Remove Success`, props<{ account: Account }>());

  export const removeFail = createAction(`${prefix} Remove Fail`, props<{ errorMessage: string }>());
}
