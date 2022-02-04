import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CamfilOrderHelper } from 'camfil-pwa/models/camfil-order/camfil-order.helper';
import { CamfilOrder } from 'camfil-pwa/models/camfil-order/camfil-order.model';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { loadOrderFail } from 'ish-core/store/customer/orders';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  cloneCamfilOrder,
  cloneCamfilOrderFail,
  cloneCamfilOrderSuccess,
  loadCamfilOrder,
  loadCamfilOrderAdditionalTotalCost,
  loadCamfilOrderAdditionalTotalCostSuccess,
  loadCamfilOrderLineItems,
  loadCamfilOrderLineItemsSuccess,
  loadCamfilOrderSuccess,
  loadCamfilOrderTrackAndTrace,
  loadCamfilOrderTrackAndTraceSuccess,
  loadCamfilOrders,
  loadCamfilOrdersSuccess,
  selectCamfilOrder,
  updateCamfilOrder,
} from './camfil-orders.actions';

export const orderAdapter = createEntityAdapter<CamfilOrder>({
  selectId: order => order.id,
});

export interface CamfilOrdersState extends EntityState<CamfilOrder> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const initialState: CamfilOrdersState = orderAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const camfilOrdersReducer = createReducer(
  initialState,
  setLoadingOn(
    cloneCamfilOrder,
    loadCamfilOrder,
    loadCamfilOrders,
    loadCamfilOrderLineItems,
    loadCamfilOrderTrackAndTrace,
    loadCamfilOrderAdditionalTotalCost
  ),
  unsetLoadingAndErrorOn(
    cloneCamfilOrderFail,
    cloneCamfilOrderSuccess,
    loadCamfilOrderSuccess,
    loadCamfilOrdersSuccess,
    loadCamfilOrderLineItemsSuccess,
    loadCamfilOrderTrackAndTraceSuccess,
    loadCamfilOrderAdditionalTotalCostSuccess
  ),
  setErrorOn(loadOrderFail),
  on(selectCamfilOrder, (state: CamfilOrdersState, action) => ({
    ...state,
    selected: action.payload.orderId,
  })),
  on(loadCamfilOrderSuccess, (state: CamfilOrdersState, action) => {
    const { order } = action.payload;

    return {
      ...orderAdapter.upsertOne(order, state),
      selected: order.id,
    };
  }),
  on(loadCamfilOrdersSuccess, (state: CamfilOrdersState, action) => {
    const { orders } = action.payload;

    return {
      ...orderAdapter.setAll(orders, state),
    };
  }),
  on(loadCamfilOrderLineItemsSuccess, (state: CamfilOrdersState, action) => {
    const { lineItems, orderId } = action.payload;
    const order = state.entities?.[orderId];
    const totalDeliveredQty = CamfilOrderHelper.getTotalDeliveredQty(lineItems);
    const totalOrderedQty = CamfilOrderHelper.getTotalOrderedQty(lineItems);
    const isPartialDelivery = CamfilOrderHelper.isPartialDelivery(order, lineItems);
    const deliveryDates = CamfilOrderHelper.getDeliveryDates(lineItems);

    return {
      ...orderAdapter.updateOne(
        {
          id: orderId,
          changes: {
            lineItems,
            totalDeliveredQty,
            totalOrderedQty,
            deliveryDates,
            isPartialDelivery,
          },
        },
        state
      ),
    };
  }),
  on(loadCamfilOrderTrackAndTraceSuccess, (state: CamfilOrdersState, action) => {
    const { trackAndTrace, orderId } = action.payload;
    return {
      ...orderAdapter.updateOne({ id: orderId, changes: { trackAndTrace } }, state),
    };
  }),
  on(loadCamfilOrderAdditionalTotalCostSuccess, (state: CamfilOrdersState, action) => {
    const { additionalTotalCost, orderId } = action.payload;
    return {
      ...orderAdapter.updateOne({ id: orderId, changes: { additionalTotalCost: additionalTotalCost.elements } }, state),
    };
  }),
  on(updateCamfilOrder, (state: CamfilOrdersState, action) => {
    const { order } = action.payload;
    return {
      ...orderAdapter.updateOne({ id: order?.id, changes: order }, state),
    };
  })
);
