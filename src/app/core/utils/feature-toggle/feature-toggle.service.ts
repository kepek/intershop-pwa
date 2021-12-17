import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getFeatures } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

export function checkFeature(features: string[], feature: string): boolean {
  if (feature === 'always') {
    return true;
  } else if (feature === 'never') {
    return false;
  } else {
    return features.includes(feature);
  }
}

@Injectable({ providedIn: 'root' })
export class FeatureToggleService {
  private featureToggles: string[] = [];

  constructor(store: Store) {
    store.pipe(select(getFeatures), whenTruthy()).subscribe(features => (this.featureToggles = features || []));
  }

  enabled(feature: string): boolean {
    return checkFeature(this.featureToggles, feature);
  }
}
