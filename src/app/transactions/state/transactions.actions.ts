import { createAction, props } from '@ngrx/store';
import { Transaction } from 'src/app/shared/models/entities.models';

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
}
