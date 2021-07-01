import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { Order } from '../../models/order/order.model';

import {
  createOrderDuplicate,
  createOrderDuplicateFail,
  createOrderDuplicateSuccess,
  loadOrder,
  loadOrderAdditionalTotalCost,
  loadOrderAdditionalTotalCostSuccess,
  loadOrderLineItems,
  loadOrderLineItemsSuccess,
  loadOrderSuccess,
  loadOrderTrackAndTrace,
  loadOrderTrackAndTraceSuccess,
  loadOrders,
  loadOrdersSuccess,
  selectOrder,
} from './order.actions';

export const orderAdapter = createEntityAdapter<Order>({
  selectId: order => order.id,
});

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const initialState: OrdersState = orderAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const orderReducer = createReducer(
  initialState,
  setLoadingOn(
    createOrderDuplicate,
    loadOrder,
    loadOrders,
    loadOrderLineItems,
    loadOrderTrackAndTrace,
    loadOrderAdditionalTotalCost
  ),
  unsetLoadingAndErrorOn(
    createOrderDuplicateFail,
    createOrderDuplicateSuccess,
    loadOrderSuccess,
    loadOrdersSuccess,
    loadOrderLineItemsSuccess,
    loadOrderTrackAndTraceSuccess,
    loadOrderAdditionalTotalCostSuccess
  ),
  on(selectOrder, (state: OrdersState, action) => ({
    ...state,
    selected: action.payload.orderId,
  })),
  on(loadOrdersSuccess, (state: OrdersState, action) => {
    const { orders } = action.payload;

    return {
      ...orderAdapter.setAll(orders, state),
    };
  }),
  on(loadOrderLineItemsSuccess, (state: OrdersState, action) => {
    const { lineItems, orderId } = action.payload;
    const totalDeliveredQty = lineItems.reduce((total, current) => total + current.deliveredQty, 0);
    const totalOrderedQty = lineItems.reduce((total, current) => total + current.orderedQty, 0);

    return {
      ...orderAdapter.updateOne(
        {
          id: orderId,
          changes: {
            lineItems,
            totalDeliveredQty,
            totalOrderedQty,
          },
        },
        state
      ),
    };
  }),
  on(loadOrderTrackAndTraceSuccess, (state: OrdersState, action) => {
    const { trackAndTrace, orderId } = action.payload;
    return {
      ...orderAdapter.updateOne({ id: orderId, changes: { trackAndTrace } }, state),
    };
  }),
  on(loadOrderAdditionalTotalCostSuccess, (state: OrdersState, action) => {
    const { additionalTotalCost, orderId } = action.payload;
    return {
      ...orderAdapter.updateOne({ id: orderId, changes: { additionalTotalCost: additionalTotalCost.elements } }, state),
    };
  })
);
