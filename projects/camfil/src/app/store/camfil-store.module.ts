import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { CamfilState } from './camfil-store';
import { OrderTemplatesEffects } from './order-templates/order-templates.effects';
import { orderTemplatesReducer } from './order-templates/order-templates.reducer';

const camfilReducers: ActionReducerMap<CamfilState> = { orderTemplates: orderTemplatesReducer };

const camfilEffects = [OrderTemplatesEffects];

const metaReducers = [resetOnLogoutMeta];

@NgModule({
  imports: [
    EffectsModule.forFeature(camfilEffects),
    StoreModule.forFeature('camfil', camfilReducers, { metaReducers }),
  ],
})
export class CamfilStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamfilState>)[]) {
    return StoreModule.forFeature('camfil', pick(camfilReducers, reducers), {
      metaReducers,
    });
  }
}
