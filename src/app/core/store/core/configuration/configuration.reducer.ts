// tslint:disable: ish-ordered-imports project-structure ban-specific-imports
import { createReducer, on } from '@ngrx/store';

import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { environment } from '../../../../../environments/environment';

import { CamfilChannelConfigurationHelper } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.helper';

import { applyConfiguration, setCurrentLocale } from './configuration.actions';
import channelSettings from 'camfil-pwa/settings';
import {
  CamfilChannelConfiguration,
  CamfilLang,
} from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  channel?: string;
  application?: string;
  identityProvider?: string;
  identityProviders?: { [id: string]: { type?: string; [key: string]: unknown } };
  features?: string[];
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
  theme: undefined,
  locales: environment.locales,
  lang: undefined,
  _deviceType: environment.defaultDeviceType,
};

const overrideConfiguration = (state: ConfigurationState, extraConfiguration?: Partial<CamfilChannelConfiguration>) => {
  const settings = {
    ...CamfilChannelConfigurationHelper.getSettingsByChannelName(channelSettings, state.channel),
    ...extraConfiguration,
  };

  const lang = settings.lang;

  const locales = state?.locales?.map(locale => {
    if (locale.lang === settings.lang) {
      return {
        ...locale,
        currency: settings.currency,
        lang: settings.lang,
      };
    }

    return locale;
  });

  return { ...state, lang, locales };
};

export const configurationReducer = createReducer(
  initialState,
  on(applyConfiguration, (state: ConfigurationState, action) => {
    const newState = {
      ...state,
      ...action.payload,
    };

    return overrideConfiguration(newState);
  }),
  on(setCurrentLocale, (state: ConfigurationState, action) => {
    const newState = {
      ...state,
      ...action.payload,
    };

    const lang = action.payload?.lang as CamfilLang;

    return overrideConfiguration(newState, { lang });
  })
);
