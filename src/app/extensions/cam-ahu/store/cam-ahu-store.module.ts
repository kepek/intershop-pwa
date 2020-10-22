import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamAhuState } from './cam-ahu-store';

const camAhuReducers: ActionReducerMap<CamAhuState> = {};

const camAhuEffects = [];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camAhuEffects), StoreModule.forFeature('camAhu', camAhuReducers)],
})
export class CamAhuStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamAhuState>)[]) {
    return StoreModule.forFeature('camAhu', pick(camAhuReducers, reducers));
  }
}
