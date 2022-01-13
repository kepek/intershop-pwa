import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { CamRequisitionManagementState } from './cam-requisition-management-store';
import { RequisitionsEffects } from './requisitions/requisitions.effects';
import { requisitionsReducer } from './requisitions/requisitions.reducer';

const requisitionManagementReducers: ActionReducerMap<CamRequisitionManagementState> = {
  requisitions: requisitionsReducer,
};

const requisitionManagementEffects = [RequisitionsEffects];

const metaReducers = [resetOnLogoutMeta];

@NgModule({
  imports: [
    EffectsModule.forFeature(requisitionManagementEffects),
    StoreModule.forFeature('camRequisitionManagement', requisitionManagementReducers, { metaReducers }),
  ],
})
export class CamRequisitionManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamRequisitionManagementState>)[]) {
    return StoreModule.forFeature('camRequisitionManagement', pick(requisitionManagementReducers, reducers), {
      metaReducers,
    });
  }
}
