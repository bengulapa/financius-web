import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Currency } from 'src/app/shared/models/entities.models';

export namespace CurrencyActions {
  const prefix = '[Currencies]';

  export const retrieve = createAction(`${prefix} Retrieve`);

  export const retrieveSuccess = createAction(
    `${prefix} Retrieve Success`,
    props<{ currencies: Currency[] }>()
  );

  export const retrieveFail = createAction(
    `${prefix} Retrieve Fail`,
    props<{ errorMessage: string }>()
  );

  export const getByKey = createAction(
    `${prefix} Retrieve by Key`,
    props<{ key: string }>()
  );

  export const getByKeySuccess = createAction(
    `${prefix} Retrieve by Key Success`,
    props<{ currency: Currency }>()
  );

  export const getByKeyFail = createAction(
    `${prefix} Retrieve by Key Fail`,
    props<{ errorMessage: string }>()
  );

  export const add = createAction(
    `${prefix} Add`,
    props<{ currency: Currency }>()
  );

  export const addSuccess = createAction(
    `${prefix} Add Success`,
    props<{ currency: Currency }>()
  );

  export const addFail = createAction(
    `${prefix} Add Fail`,
    props<{ errorMessage: string }>()
  );

  export const update = createAction(
    `${prefix} Update`,
    props<{ currency: Currency }>()
  );

  export const updateSuccess = createAction(
    `${prefix} Update Success`,
    props<{ currency: Update<Currency> }>()
  );

  export const updateFail = createAction(
    `${prefix} Update Fail`,
    props<{ errorMessage: string }>()
  );

  export const updatePreviousMain = createAction(
    `${prefix} Update Previous Main`,
    props<{ currency: Currency }>()
  );

  export const remove = createAction(
    `${prefix} Remove`,
    props<{ currency: Currency }>()
  );

  export const removeSuccess = createAction(
    `${prefix} Remove Success`,
    props<{ currency: Currency }>()
  );

  export const removeFail = createAction(
    `${prefix} Remove Fail`,
    props<{ errorMessage: string }>()
  );
}
