import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { CamfilOrdersEffects } from './camfil-orders/camfil-orders.effects';
import { camfilOrdersReducer } from './camfil-orders/camfil-orders.reducer';
import { CamfilPwaState } from './camfil-pwa-store';
import { CamfilUserEffects } from './camfil-user/camfil-user.effects';
import { camfilUserReducer } from './camfil-user/camfil-user.reducer';

const camfilPwaReducers: ActionReducerMap<CamfilPwaState> = {
  camfilUser: camfilUserReducer,
  camfilOrders: camfilOrdersReducer,
};

const camfilPwaEffects = [CamfilUserEffects, CamfilOrdersEffects];

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(camfilPwaEffects),
    StoreModule.forFeature('camfilPwa', camfilPwaReducers, { metaReducers }),
  ],
})
export class CamfilPwaStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamfilPwaState>)[]) {
    return StoreModule.forFeature('camfilPwa', pick(camfilPwaReducers, reducers), { metaReducers });
  }
}
