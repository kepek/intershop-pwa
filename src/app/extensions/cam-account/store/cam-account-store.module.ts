import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ApplicantEffects } from './applicant/applicant.effects';
import { applicantReducer } from './applicant/applicant.reducer';
import { CamAccountState } from './cam-account-store';

const camAccountReducers: ActionReducerMap<CamAccountState> = {
  applicant: applicantReducer,
};

const camAccountEffects = [ApplicantEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camAccountEffects), StoreModule.forFeature('camAccount', camAccountReducers)],
})
export class CamAccountStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamAccountState>)[]) {
    return StoreModule.forFeature('camAccount', pick(camAccountReducers, reducers));
  }
}
