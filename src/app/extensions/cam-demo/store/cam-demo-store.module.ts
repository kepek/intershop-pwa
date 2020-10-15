import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamDemoState } from './cam-demo-store';

const camDemoReducers: ActionReducerMap<CamDemoState> = {};

const camDemoEffects = [];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camDemoEffects), StoreModule.forFeature('camDemo', camDemoReducers)],
})
export class CamDemoStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamDemoState>)[]) {
    return StoreModule.forFeature('camDemo', pick(camDemoReducers, reducers));
  }
}
