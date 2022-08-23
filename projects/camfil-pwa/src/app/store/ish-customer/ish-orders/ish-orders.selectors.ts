import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';
import { orderAdapter } from 'ish-core/store/customer/orders/orders.reducer';

export const getOrdersState = createSelector(getCustomerState, state => state.orders);

export const { selectEntities: getOrderEntities } = orderAdapter.getSelectors(getOrdersState);
