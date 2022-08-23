import { createAction } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
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

export const reloadBasket = createAction('[Camfil Basket Internal] Reload Basket');

export const getWarehouseCalendar = createAction('[Camfil Basket] Get warehouse calendar');

export const getWarehouseCalendarSuccess = createAction(
  '[Camfil Basket] Get warehouse calendar Success',
  payload<{ dates: [] }>()
);

export const getWarehouseCalendarFail = createAction('[Camfil Basket] Get warehouse calendar Fail', httpError());

export const loadBuckets = createAction('[Basket] Load Buckets', payload<{ basket: Basket }>());

export const loadBucketsFail = createAction('[Basket] Load Buckets Fail', httpError());

export const loadBucketsSuccess = createAction('[Basket] Load Buckets Success', payload<{ buckets: Bucket[] }>());

export const connectBuckets = createAction('[Basket] Connect buckets', payload<{ buckets: Bucket[] }>());

export const noop = createAction('[Camfil] NOOP');
