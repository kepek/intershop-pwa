import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { Channel } from 'ish-core/models/channel/channel.types';
import { getCoreState } from 'ish-core/store/core/core-store';

import { ConfigurationState } from './configuration.reducer';

export const getConfigurationState = createSelector(getCoreState, state => state.configuration);

export const getICMApplication = createSelector(getConfigurationState, state => state.application || '-');

export const getICMServerURL = createSelector(getConfigurationState, state =>
  state.baseURL && state.server ? `${state.baseURL}/${state.server}` : undefined
);

export const getRestEndpoint = createSelector(
  getICMServerURL,
  getConfigurationState,
  getICMApplication,
  (serverUrl, state, application) =>
    serverUrl && state.channel ? `${serverUrl}/${state.channel}/${application}` : undefined
);

export const getICMStaticURL = createSelector(getConfigurationState, getICMApplication, (state, application) =>
  state.baseURL && state.serverStatic && state.channel
    ? `${state.baseURL}/${state.serverStatic}/${state.channel}/${application}`
    : undefined
);

export const getICMBaseURL = createSelector(getConfigurationState, state => state.baseURL);

export const getFeatures = createSelector(getConfigurationState, state => state.features);

export const getGTMToken = createSelector(getConfigurationState, state => state.gtmToken);

export const getTheme = createSelector(getConfigurationState, state => state.theme);

export const getAvailableLocales = createSelector(getConfigurationState, state => state.locales);

export const getLang = createSelector(getConfigurationState, state => {
  return state.lang;
});

export const getDeviceType = createSelector(getConfigurationState, state => state._deviceType);

export const getIdentityProvider = createSelectorFactory(projector => defaultMemoize(projector, undefined, isEqual))(
  getConfigurationState,
  (state: ConfigurationState) =>
    state.identityProvider &&
    (state.identityProvider === 'ICM' ? { type: 'ICM' } : state.identityProviders?.[state.identityProvider])
);

export const getCamfilChannel = createSelector(getConfigurationState, state => state?.channel);

export const getCountryByChannel = createSelector(
  getConfigurationState,
  state => Object.entries(Channel).find(([, val]) => val === state?.channel)?.[0]
);

/**
 * selects the current locale if set. If not returns the first available locale
 */
export const getCurrentLocale = createSelector(
  getLang,
  getAvailableLocales,
  getCountryByChannel,
  (lang, availableLocales, countryCode) => {
    return (
      availableLocales.find(l => l.lang === lang) ||
      availableLocales.find(l => l.value === countryCode?.toLowerCase()) ||
      availableLocales[0]
    );
  }
);
