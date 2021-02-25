import { createSelector } from '@ngrx/store';

import { Order } from '../../models/order/order.model';
import { getCamAccountState } from '../cam-account-store';

import { orderAdapter } from './order.reducer';

const getOrdersState = createSelector(getCamAccountState, state => state.orders);

const { selectEntities, selectAll } = orderAdapter.getSelectors(getOrdersState);

export const getSelectedOrderId = createSelector(getOrdersState, state => state.selected);

export const getSelectedOrder = createSelector(
  selectEntities,
  getSelectedOrderId,
  (entities, id): Order => id && entities[id]
);

export const getOrders = selectAll;

export const getOrder = createSelector(
  selectAll,
  (entities, props: { orderId: string }): Order => entities.find(e => e.id === props.orderId)
);

export const getOrdersLoading = createSelector(getOrdersState, orders => orders.loading);

export const getOrdersError = createSelector(getOrdersState, orders => orders.error);

export const getOrderLoading = createSelector(getOrdersState, state => state.loading);

export const getOrderLineItems = createSelector(getSelectedOrder, order => order.lineItems);
