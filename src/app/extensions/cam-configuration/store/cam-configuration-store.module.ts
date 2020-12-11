import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamConfigurationState } from './cam-configuration-store';
import { ConfigurationEffects } from './configuration/configuration.effects';
import { configurationReducer } from './configuration/configuration.reducer';

const camConfigurationReducers: ActionReducerMap<CamConfigurationState> = {
  configuration: configurationReducer,
};

const camConfigurationEffects = [ConfigurationEffects];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(camConfigurationEffects),
    StoreModule.forFeature('camConfiguration', camConfigurationReducers),
  ],
})
export class CamConfigurationStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamConfigurationState>)[]) {
    return StoreModule.forFeature('camConfiguration', pick(camConfigurationReducers, reducers));
  }
}
