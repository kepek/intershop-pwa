import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CamfilChannelSetting } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';
import {
  getCamfilConfigurationParameter,
  getChannelCode,
  getContinueShoppingUrl,
  getCurrency,
  getICMChannel,
  getLanguages,
  getZipCodeRegExp,
} from 'camfil-pwa/store/camfil-configuration';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamfilConfigurationFacade {
  constructor(private store: Store) {}

  isEnabled$(setting: CamfilChannelSetting) {
    return this.store.pipe(select(getCamfilConfigurationParameter<boolean, CamfilChannelSetting>(setting)));
  }

  languages$ = this.store.pipe(select(getLanguages));

  channelCode$ = this.store.pipe(select(getChannelCode));

  currency$ = this.store.pipe(select(getCurrency));

  icmChannel$ = this.store.pipe(select(getICMChannel));

  continueShoppingUrl$ = this.store.pipe(select(getContinueShoppingUrl));

  zipCodeRegExp$ = this.store.pipe(select(getZipCodeRegExp));
}
