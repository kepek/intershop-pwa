import { createFeatureSelector } from '@ngrx/store';
import { CamfilConfigurationState } from 'camfil-pwa/store/camfil-configuration/camfil-configuration.reducer';
import { CamfilICCState } from 'camfil-pwa/store/camfil-icc/camfil-icc.reducer';
import { CamfilProductsState } from 'camfil-pwa/store/camfil-shopping/camfil-products/camfil-products.reducer';

import { CamfilOrdersState } from './camfil-orders/camfil-orders.reducer';
import { CamfilUserState } from './camfil-user/camfil-user.reducer';

export interface CamfilPwaState {
  camfilUser: CamfilUserState;
  camfilOrders: CamfilOrdersState;
  camfilConfiguration: CamfilConfigurationState;
  camfilIcc: CamfilICCState;
  camfilProducts: CamfilProductsState;
}

export const getCamfilPwaState = createFeatureSelector<CamfilPwaState>('camfilPwa');
