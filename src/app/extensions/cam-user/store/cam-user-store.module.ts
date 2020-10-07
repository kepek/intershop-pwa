import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamUserState } from './cam-user-store';

const camUserReducers: ActionReducerMap<CamUserState> = {};

const camUserEffects = [];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camUserEffects), StoreModule.forFeature('camUser', camUserReducers)],
})
export class CamUserStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamUserState>)[]) {
    return StoreModule.forFeature('camUser', pick(camUserReducers, reducers));
  }
}
