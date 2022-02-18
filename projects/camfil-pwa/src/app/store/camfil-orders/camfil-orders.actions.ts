import { createAction } from '@ngrx/store';
import { CamfilOrderLineItem } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.model';
import { CamfilOrder } from 'camfil-pwa/models/camfil-order/camfil-order.model';

import { Basket } from 'ish-core/models/basket/basket.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCamfilOrder = createAction('[Orders Camfil Internal] Load Order', payload<{ orderId: string }>());

export const loadCamfilOrderFail = createAction('[Orders Camfil API] Load Order Fail', httpError());

export const loadCamfilOrderIfNotLoaded = createAction(
  '[Orders Camfil Internal] Load Order if not Loaded',
  payload<{ orderId: string }>()
);

export const loadCamfilOrderSuccess = createAction(
  '[Orders Camfil API] Load Order Success',
  payload<{ order: CamfilOrder }>()
);

export const loadCamfilOrders = createAction('[Orders Camfil] Load Orders');

export const loadCamfilOrdersFail = createAction('[Orders Camfil API] Load Orders Fail', httpError());

export const loadCamfilOrdersSuccess = createAction(
  '[Orders Camfil API] Load Orders Success',
  payload<{ orders: CamfilOrder[] }>()
);

export const selectCamfilOrder = createAction('[Orders Camfil] Select Order', payload<{ orderId: string }>());

export const loadCamfilOrderLineItems = createAction(
  '[Order Camfil API] Load Order LineItems',
  payload<{ orderId: string }>()
);

export const loadCamfilOrderLineItemsFail = createAction('[Orders Camfil API] Load Order LineItems Fail', httpError());

export const loadCamfilOrderLineItemsSuccess = createAction(
  '[Orders Camfil API] Load Order LineItems Success',
  payload<{ orderId: string; lineItems: CamfilOrderLineItem[] }>()
);

export const loadCamfilOrderTrackAndTrace = createAction(
  '[Order Camfil Internal] Load Order Track and Trace',
  payload<{ orderId: string }>()
);

export const loadCamfilOrderTrackAndTraceFail = createAction('[Orders Camfil API] Load Order Track and Trace Fail');

export const loadCamfilOrderTrackAndTraceSuccess = createAction(
  '[Orders Camfil API] Load Order Track and Trace Success',
  payload<{ orderId: string; trackAndTrace }>()
);

export const loadCamfilOrderAdditionalTotalCost = createAction(
  '[Order Camfil Internal] Load Order Additional Total Cost',
  payload<{ orderId: string }>()
);

export const loadCamfilOrderAdditionalTotalCostFail = createAction(
  '[Orders Camfil API] Load Order Additional Total Cost Fail',
  httpError()
);

export const loadCamfilOrderAdditionalTotalCostSuccess = createAction(
  '[Orders Camfil API] Load Order Additional Total Cost Success',
  payload<{ orderId: string; additionalTotalCost }>()
);

export const cloneCamfilOrder = createAction(
  '[Order Camfil Internal] Create order duplicate',
  payload<{ orderId: string }>()
);

export const cloneCamfilOrderFail = createAction('[Orders Camfil API] Create order duplicate Fail', httpError());

export const cloneCamfilOrderSuccess = createAction(
  '[Orders Camfil API] Create order duplicate Success',
  payload<{ basket: Basket }>()
);

export const updateCamfilOrder = createAction(
  '[Orders Camfil Internal] Update Order',
  payload<{ order: CamfilOrder }>()
);
