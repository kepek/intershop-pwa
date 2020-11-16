import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamAhuState } from './cam-ahu-store';
import { ManufacturerEffects } from './manufacturer/manufacturer.effects';
import { manufacturerReducer } from './manufacturer/manufacturer.reducer';
import { UnitEffects } from './unit/unit.effects';
import { unitReducer } from './unit/unit.reducer';

const camAhuReducers: ActionReducerMap<CamAhuState> = {
  manufacturers: manufacturerReducer,
  units: unitReducer,
};

const camAhuEffects = [ManufacturerEffects, UnitEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camAhuEffects), StoreModule.forFeature('camAhu', camAhuReducers)],
})
export class CamAhuStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamAhuState>)[]) {
    return StoreModule.forFeature('camAhu', pick(camAhuReducers, reducers));
  }
}
