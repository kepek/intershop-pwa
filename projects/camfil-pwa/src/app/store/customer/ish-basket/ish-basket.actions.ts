import { createAction } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const camfilUpdateBasketAddress = createAction(
  '[Camfil Basket Address API] Update an Address at Basket',
  payload<{ address: Address; isBasket?: boolean }>()
);

export const camfilUpdateBasketAddressFail = createAction(
  '[Camfil Basket Address API] Update an Address at Basket Fail',
  httpError()
);
