import { createFeatureSelector } from '@ngrx/store';

import { ApplicantState } from './applicant/applicant.reducer';
import { OrdersState } from './order/order.reducer';
import { UserState } from './user/user.reducer';

export interface CamAccountState {
  applicant: ApplicantState;
  user: UserState;
  orders: OrdersState;
}

export const getCamAccountState = createFeatureSelector<CamAccountState>('camAccount');
