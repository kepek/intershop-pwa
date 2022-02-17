import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ChannelSettings } from '../models/channel-configuration/channel-configuration.model';
import { getCamConfigurationState } from '../store/cam-configuration-store';
import {
  getCamfilConfigurationParameter,
  getContinueShoppingUrl,
  getCountryCode,
  getShowPricesForNonLoggedInUser,
  getUseSecondAddressLine,
} from '../store/configuration';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamConfigurationFacade {
  constructor(private store: Store) {}

  getChannelSetting$(path: keyof ChannelSettings) {
    return this.store.pipe(select(getCamfilConfigurationParameter<boolean>(path)));
  }

  /**
   * example for debugging
   */
  camConfigurationState$ = this.store.pipe(select(getCamConfigurationState));

  showPricesForNonLoggedInUser$ = this.store.pipe(select(getShowPricesForNonLoggedInUser));

  countryCode$ = this.store.pipe(select(getCountryCode));

  useSecondAddressLine$ = this.store.pipe(select(getUseSecondAddressLine));

  continueShoppingUrl$ = this.store.pipe(select(getContinueShoppingUrl));
}
