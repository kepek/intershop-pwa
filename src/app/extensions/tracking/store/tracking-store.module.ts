import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { TrackingEffects } from './tracking/tracking.effects';

const trackingEffects = [TrackingEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(trackingEffects)],
})
export class TrackingStoreModule {}
