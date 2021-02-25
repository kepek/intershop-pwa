import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ApplicantEffects } from './applicant/applicant.effects';
import { applicantReducer } from './applicant/applicant.reducer';
import { CamAccountState } from './cam-account-store';
import { OrderEffects } from './order/order.effects';
import { orderReducer } from './order/order.reducer';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

const camAccountReducers: ActionReducerMap<CamAccountState> = {
  applicant: applicantReducer,
  user: userReducer,
  orders: orderReducer,
};

const camAccountEffects = [ApplicantEffects, UserEffects, OrderEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camAccountEffects), StoreModule.forFeature('camAccount', camAccountReducers)],
})
export class CamAccountStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamAccountState>)[]) {
    return StoreModule.forFeature('camAccount', pick(camAccountReducers, reducers));
  }
}
