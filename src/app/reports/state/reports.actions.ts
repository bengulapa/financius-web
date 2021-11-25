import { createAction } from '@ngrx/store';

export namespace ReportsActions {
  const prefix = '[Reports]';

  export const reportsPageOpened = createAction(`${prefix} Page Opened`);
}
