import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { CamRequisitionManagementState } from './cam-requisition-management-store';
import { CamfilRequisitionsEffects } from './camfil-requisitions/camfil-requisitions.effects';
import { requisitionsReducer } from './camfil-requisitions/camfil-requisitions.reducer';

const camfilRequisitionManagementReducers: ActionReducerMap<CamRequisitionManagementState> = {
  requisitions: requisitionsReducer,
};

const camfilRequisitionManagementEffects = [CamfilRequisitionsEffects];

const metaReducers = [resetOnLogoutMeta];

@NgModule({
  imports: [
    EffectsModule.forFeature(camfilRequisitionManagementEffects),
    StoreModule.forFeature('camRequisitionManagement', camfilRequisitionManagementReducers, { metaReducers }),
  ],
})
export class CamRequisitionManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamRequisitionManagementState>)[]) {
    return StoreModule.forFeature('camRequisitionManagement', pick(camfilRequisitionManagementReducers, reducers), {
      metaReducers,
    });
  }
}
