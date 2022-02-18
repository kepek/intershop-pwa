import { createFeatureSelector } from '@ngrx/store';

import { CamfilOrdersState } from './camfil-orders/camfil-orders.reducer';
import { CamfilUserState } from './camfil-user/camfil-user.reducer';

export interface CamfilPwaState {
  camfilUser: CamfilUserState;
  camfilOrders: CamfilOrdersState;
}

export const getCamfilPwaState = createFeatureSelector<CamfilPwaState>('camfilPwa');
