import { createFeatureSelector } from '@ngrx/store';
import { CamfilConfigurationState } from 'camfil-pwa/store/camfil-configuration/camfil-configuration.reducer';

import { CamfilOrdersState } from './camfil-orders/camfil-orders.reducer';
import { CamfilUserState } from './camfil-user/camfil-user.reducer';

export interface CamfilPwaState {
  camfilUser: CamfilUserState;
  camfilOrders: CamfilOrdersState;
  camfilConfiguration: CamfilConfigurationState;
}

export const getCamfilPwaState = createFeatureSelector<CamfilPwaState>('camfilPwa');
