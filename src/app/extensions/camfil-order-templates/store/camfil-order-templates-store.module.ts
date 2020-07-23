import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamfilOrderTemplatesState } from './camfil-order-templates-store';

const camfilOrderTemplatesReducers: ActionReducerMap<CamfilOrderTemplatesState> = {};

const camfilOrderTemplatesEffects = [];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(camfilOrderTemplatesEffects),
    StoreModule.forFeature('camfilOrderTemplates', camfilOrderTemplatesReducers),
  ],
})
export class CamfilOrderTemplatesStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamfilOrderTemplatesState>)[]) {
    return StoreModule.forFeature('camfilOrderTemplates', pick(camfilOrderTemplatesReducers, reducers));
  }
}
