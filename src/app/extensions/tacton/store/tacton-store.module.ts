import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { localStorageSaveMeta } from 'ish-core/utils/meta-reducers';

import { ProductConfigurationEffects } from './product-configuration/product-configuration.effects';
import { productConfigurationReducer } from './product-configuration/product-configuration.reducer';
import { SavedTactonConfigurationEffects } from './saved-tacton-configuration/saved-tacton-configuration.effects';
import { savedTactonConfigurationReducer } from './saved-tacton-configuration/saved-tacton-configuration.reducer';
import { TactonConfigEffects } from './tacton-config/tacton-config.effects';
import { tactonConfigReducer } from './tacton-config/tacton-config.reducer';
import { TactonState } from './tacton-store';

const tactonReducers: ActionReducerMap<TactonState> = {
  productConfiguration: productConfigurationReducer,
  tactonConfig: tactonConfigReducer,
  savedTactonConfiguration: savedTactonConfigurationReducer,
};

const tactonEffects = [ProductConfigurationEffects, TactonConfigEffects, SavedTactonConfigurationEffects];

const metaReducers = [localStorageSaveMeta<TactonState>('tacton', 'savedTactonConfiguration')];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(tactonEffects),
    StoreModule.forFeature('_tacton', tactonReducers, { metaReducers }),
  ],
})
export class TactonStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<TactonState>)[]) {
    return StoreModule.forFeature('_tacton', pick(tactonReducers, reducers));
  }
}
