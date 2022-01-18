import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCamConfigurationState } from '../store/cam-configuration-store';
import { getCountryCode, getShowPricesForNonLoggedInUser, getUseSecondAddressLine } from '../store/configuration';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamConfigurationFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  camConfigurationState$ = this.store.pipe(select(getCamConfigurationState));

  showPricesForNonLoggedInUser$ = this.store.pipe(select(getShowPricesForNonLoggedInUser));

  countryCode$ = this.store.pipe(select(getCountryCode));

  useSecondAddressLine$ = this.store.pipe(select(getUseSecondAddressLine));
}
