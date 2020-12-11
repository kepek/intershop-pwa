import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamIccState } from './cam-icc-store';
import { IccEffects } from './icc/icc.effects';
import { iccReducer } from './icc/icc.reducer';

const camIccReducers: ActionReducerMap<CamIccState> = {
  _icc: iccReducer,
};

const camIccEffects = [IccEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camIccEffects), StoreModule.forFeature('camIcc', camIccReducers)],
})
export class CamIccStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamIccState>)[]) {
    return StoreModule.forFeature('camIcc', pick(camIccReducers, reducers));
  }
}
