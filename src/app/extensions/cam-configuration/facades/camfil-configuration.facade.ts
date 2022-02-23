import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ChannelSetting } from '../models/channel-configuration/channel-configuration.model';
import { getCamConfigurationState } from '../store/cam-configuration-store';
import {
  getCamfilConfigurationParameter,
  getChannelCode,
  getContinueShoppingUrl,
  getCurrency,
  getICMChannel,
  getLanguages,
} from '../store/configuration';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamfilConfigurationFacade {
  constructor(private store: Store) {}

  isEnabled$(setting: ChannelSetting) {
    return this.store.pipe(select(getCamfilConfigurationParameter<boolean, ChannelSetting>(setting)));
  }

  camConfigurationState$ = this.store.pipe(select(getCamConfigurationState));

  languages$ = this.store.pipe(select(getLanguages));

  channelCode$ = this.store.pipe(select(getChannelCode));

  currency$ = this.store.pipe(select(getCurrency));

  icmChannel$ = this.store.pipe(select(getICMChannel));

  continueShoppingUrl$ = this.store.pipe(select(getContinueShoppingUrl));
}
