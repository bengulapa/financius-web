import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Transaction } from 'src/app/shared/models/entities.models';
import { TransactionFilter } from 'src/app/shared/models/view.models';

export namespace TransactionActions {
  const key = '[Transactions]';

  export const retrieve = createAction(`${key} Retrieve`);

  export const retrieveSuccess = createAction(
    `${key} Retrieve Success`,
    props<{ transactions: Transaction[] }>()
  );

  export const retrieveFail = createAction(
    `${key} Retrieve Fail`,
    props<{ errorMessage: string }>()
  );

  export const add = createAction(
    `${key} Add`,
    props<{ transaction: Transaction }>()
  );

  export const addSuccess = createAction(
    `${key} Add Success`,
    props<{ transaction: Transaction }>()
  );

  export const addFail = createAction(
    `${key} Add Fail`,
    props<{ errorMessage: string }>()
  );

  export const update = createAction(
    `${key} Update`,
    props<{ old: Transaction; update: Transaction }>()
  );

  export const updateSuccess = createAction(
    `${key} Update Success`,
    props<{ old: Transaction; transaction: Update<Transaction> }>()
  );

  export const updateFail = createAction(
    `${key} Update Fail`,
    props<{ errorMessage: string }>()
  );

  export const remove = createAction(
    `${key} Remove`,
    props<{ transaction: Transaction }>()
  );

  export const removeSuccess = createAction(
    `${key} Remove Success`,
    props<{ transaction: Transaction }>()
  );

  export const removeFail = createAction(
    `${key} Remove Fail`,
    props<{ errorMessage: string }>()
  );

  export const updateFilter = createAction(
    `${key} Update Filter`,
    props<{ filter: TransactionFilter }>()
  );

  export const resetFilter = createAction(`${key} Reset Filter`);
}
