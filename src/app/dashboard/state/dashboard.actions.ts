import { createAction } from '@ngrx/store';

export namespace DashboardActions {
  const prefix = '[Dashboard]';

  export const dashboardPageOpened = createAction(`${prefix} Page Opened`);
}
