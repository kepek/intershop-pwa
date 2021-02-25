import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Order } from '../../models/order/order.model';

export const loadOrder = createAction('[Order Camfil API] Load Order', payload<{ orderId: string }>());

export const loadOrderFail = createAction('[Orders Camfil API] Load Order Fail', httpError());

export const loadOrderSuccess = createAction('[Orders Camfil API] Load Order Success', payload<{ order: Order }>());

export const loadOrders = createAction('[Orders Camfil] Load Orders');

export const loadOrdersFail = createAction('[Orders Camfil API] Load Orders Fail', httpError());

export const loadOrdersSuccess = createAction(
  '[Orders Camfil API] Load Orders Success',
  payload<{ orders: Order[] }>()
);

export const selectOrder = createAction('[Orders Camfil] Select Order', payload<{ orderId: string }>());

export const loadOrderLineItems = createAction(
  '[Order Camfil API] Load Order LineItems',
  payload<{ orderId: string }>()
);

export const loadOrderLineItemsFail = createAction('[Orders Camfil API] Load Order LineItems Fail', httpError());

export const loadOrderLineItemsSuccess = createAction(
  '[Orders Camfil API] Load Order LineItems Success',
  payload<{ orderId: string; lineItems }>()
);

export const loadOrderTrackAndTrace = createAction(
  '[Order Camfil API] Load Order Track and Trace',
  payload<{ orderId: string }>()
);

export const loadOrderTrackAndTraceFail = createAction('[Orders Camfil API] Load Order Track and Trace Fail');

export const loadOrderTrackAndTraceSuccess = createAction(
  '[Orders Camfil API] Load Order Track and Trace Success',
  payload<{ orderId: string; trackAndTrace }>()
);

export const loadOrderAdditionalTotalCost = createAction(
  '[Order Camfil API] Load Order Additional Total Cost',
  payload<{ orderId: string }>()
);

export const loadOrderAdditionalTotalCostFail = createAction(
  '[Orders Camfil API] Load Order Additional Total Cost Fail',
  httpError()
);

export const loadOrderAdditionalTotalCostSuccess = createAction(
  '[Orders Camfil API] Load Order Additional Total Cost Success',
  payload<{ orderId: string; additionalTotalCost }>()
);

export const createOrderDuplicate = createAction(
  '[Order Camfil API] Create order duplicate',
  payload<{ orderId: string }>()
);

export const createOrderDuplicateFail = createAction('[Orders Camfil API] Create order duplicate Fail', httpError());

export const createOrderDuplicateSuccess = createAction(
  '[Orders Camfil API] Create order duplicate Success',
  payload<{ orderId: string; createdOrder }>()
);
