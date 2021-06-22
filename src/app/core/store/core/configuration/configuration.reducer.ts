import { createReducer, on } from '@ngrx/store';

import { Channel, ChannelCurrency } from 'ish-core/models/channel/channel.types';
import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { environment } from '../../../../../environments/environment';

import { applyConfiguration, setCurrentLocale, setGTMToken } from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  channel?: string;
  application?: string;
  identityProvider?: string;
  identityProviders?: { [id: string]: { type?: string; [key: string]: unknown } };
  features?: string[];
  gtmToken?: string;
  theme?: string;
  locales?: Locale[];
  lang?: string;
  // not synced via state transfer
  _deviceType?: DeviceType;
}

const initialState: ConfigurationState = {
  baseURL: undefined,
  server: undefined,
  serverStatic: undefined,
  channel: undefined,
  application: undefined,
  features: undefined,
  gtmToken: undefined,
  theme: undefined,
  locales: environment.locales,
  lang: undefined,
  _deviceType: environment.defaultDeviceType,
};

export const configurationReducer = createReducer(
  initialState,
  on(applyConfiguration, (state: ConfigurationState, { payload }) => {
    const channelCode = Object.entries(Channel).find(
      ([, val]) => val === payload.channel || val === state.channel
    )?.[0];

    const locales = state.locales.map(l => {
      const currency = l.lang === payload.lang ? ChannelCurrency[channelCode] || l.currency : l.currency;
      return {
        ...l,
        currency,
      };
    });

    const lang = payload?.lang || locales?.find(l => l?.value === channelCode?.toLowerCase())?.lang;

    return { ...state, ...payload, locales, lang };
  }),
  on(setGTMToken, (state: ConfigurationState, action) => {
    const { gtmToken } = action.payload;
    return { ...state, gtmToken };
  }),
  on(setCurrentLocale, (state: ConfigurationState, action) => {
    const { lang } = action.payload;
    return { ...state, lang };
  })
);
