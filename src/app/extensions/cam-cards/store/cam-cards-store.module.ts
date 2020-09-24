import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { CamCardEffects } from './cam-card/cam-card.effects';
import { camCardReducer } from './cam-card/cam-card.reducer';
import { CamCardsState } from './cam-cards-store';

const camCardsReducers: ActionReducerMap<CamCardsState> = {
  camCards: camCardReducer,
};

const camCardsEffects = [CamCardEffects];

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(camCardsEffects),
    StoreModule.forFeature('camCards', camCardsReducers, { metaReducers }),
  ],
})
export class CamCardsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamCardsState>)[]) {
    return StoreModule.forFeature('camCards', pick(camCardsReducers, reducers), { metaReducers });
  }
}
