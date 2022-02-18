import { createSelector } from '@ngrx/store';
import { CamfilOrder } from 'camfil-pwa/models/camfil-order/camfil-order.model';
import { getCamfilPwaState } from 'camfil-pwa/store/camfil-pwa-store';

import { orderAdapter } from './camfil-orders.reducer';

const getCamfilOrdersState = createSelector(getCamfilPwaState, state => state.camfilOrders);

export const { selectEntities: getCamfilOrderEntities, selectAll } = orderAdapter.getSelectors(getCamfilOrdersState);

export const getSelectedOrderId = createSelector(getCamfilOrdersState, state => state.selected);

export const getSelectedOrder = createSelector(
  getCamfilOrderEntities,
  getSelectedOrderId,
  (entities, id): CamfilOrder => id && entities[id]
);

export const getOrders = selectAll;

export const getOrder = createSelector(
  selectAll,
  (entities, props: { orderId: string }): CamfilOrder => entities.find(e => e.id === props.orderId)
);

export const getCamfilOrdersLoading = createSelector(getCamfilOrdersState, state => state.loading);

export const getCamfilOrdersError = createSelector(getCamfilOrdersState, state => state.error);

export const getSelectedOrderLineItems = createSelector(getSelectedOrder, order => order.lineItems);
