import { createAction } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const camfilUpdateBasketAddress = createAction(
  '[Camfil Basket Address API] Update an Address at Basket',
  payload<{ address: Address; isBasket?: boolean }>()
);

export const camfilUpdateBasketAddressFail = createAction(
  '[Camfil Basket Address API] Update an Address at Basket Fail',
  httpError()
);

export const camfilUpdateBasketItemsSuccess = createAction(
  '[Camfil Basket API] Update Basket Items Success',
  payload<{ lineItemUpdates: LineItemUpdate[]; info: BasketInfo[] }>()
);
