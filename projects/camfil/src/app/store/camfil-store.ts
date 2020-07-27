import { createFeatureSelector } from '@ngrx/store';

import { OrderTemplatesState } from './order-templates/order-templates.reducer';

export interface CamfilState {
  orderTemplates: OrderTemplatesState;
}

export const getCamfilState = createFeatureSelector<CamfilState>('camfil');
