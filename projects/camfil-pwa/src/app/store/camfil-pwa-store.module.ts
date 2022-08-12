import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { CamfilConfigurationEffects } from 'camfil-pwa/store/camfil-configuration/camfil-configuration.effects';
import { CamfilProductsEffects } from 'camfil-pwa/store/camfil-shopping/camfil-products/camfil-products.effects';
import { camfilProductsReducer } from 'camfil-pwa/store/camfil-shopping/camfil-products/camfil-products.reducer';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { camfilConfigurationReducer } from './camfil-configuration/camfil-configuration.reducer';
import { CamfilIccEffects } from './camfil-icc/camfil-icc.effects';
import { camfilIccReducer } from './camfil-icc/camfil-icc.reducer';
import { CamfilOrdersEffects } from './camfil-orders/camfil-orders.effects';
import { camfilOrdersReducer } from './camfil-orders/camfil-orders.reducer';
import { CamfilPwaState } from './camfil-pwa-store';
import { CamfilUserEffects } from './camfil-user/camfil-user.effects';
import { camfilUserReducer } from './camfil-user/camfil-user.reducer';

const camfilPwaReducers: ActionReducerMap<CamfilPwaState> = {
  camfilUser: camfilUserReducer,
  camfilOrders: camfilOrdersReducer,
  camfilConfiguration: camfilConfigurationReducer,
  camfilIcc: camfilIccReducer,
  camfilProducts: camfilProductsReducer,
};

const camfilPwaEffects = [
  CamfilUserEffects,
  CamfilOrdersEffects,
  CamfilConfigurationEffects,
  CamfilIccEffects,
  CamfilProductsEffects,
];

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
