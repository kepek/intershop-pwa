// tslint:disable: ish-ordered-imports project-structure ban-specific-imports
import { createReducer, on } from '@ngrx/store';

import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { environment } from '../../../../../environments/environment';

import { ChannelConfigurationHelper } from '../../../../extensions/cam-configuration/models/channel-configuration/channel-configuration.helper';

import { applyConfiguration, setCurrentLocale } from './configuration.actions';
import channelSettings from '../../../../extensions/cam-configuration/settings';

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

const overrideLocalesCurrency = (state: ConfigurationState) => {
  const settings = ChannelConfigurationHelper.getSettingsByChannelName(channelSettings, state.channel);

  if (settings?.currency && state?.locales?.length) {
    const locales = state.locales.map(locale => ({
      ...locale,
      currency: settings.currency,
    }));

    return { locales };
  }

  return {};
};

export const configurationReducer = createReducer(
  initialState,
  on(applyConfiguration, (state: ConfigurationState, action) => {
    const newState = {
      ...state,
      ...action.payload,
    };

    return {
      ...newState,
      ...overrideLocalesCurrency(newState),
    };
  }),
  on(setCurrentLocale, (state: ConfigurationState, action) => {
    const { lang } = action.payload;

    return { ...state, lang };
  })
);
