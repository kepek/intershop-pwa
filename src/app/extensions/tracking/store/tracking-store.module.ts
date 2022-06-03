import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { TrackingConfigEffects } from './tracking-config/tracking-config.effects';
import { trackingConfigReducer } from './tracking-config/tracking-config.reducer';
import { TrackingEventsEffects } from './tracking-events/tracking-events.effects';
import { TrackingState } from './tracking-store';

const trackingReducers: ActionReducerMap<TrackingState> = {
  gtmToken: trackingConfigReducer,
};

const trackingEffects = [TrackingConfigEffects, TrackingEventsEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(trackingEffects), StoreModule.forFeature('tracking', trackingReducers)],
})
export class TrackingStoreModule {}
