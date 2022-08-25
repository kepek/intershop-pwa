import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const loadOrderIfNotLoaded = createAction(
  '[Orders Internal] Load Order if not Loaded',
  payload<{ orderId: string }>()
);
