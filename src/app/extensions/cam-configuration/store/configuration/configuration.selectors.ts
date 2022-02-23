import { createSelector } from '@ngrx/store';
import { isBoolean } from 'lodash-es';

import { getCamConfigurationState } from '../cam-configuration-store';

export const getConfigurationState = createSelector(getCamConfigurationState, state => state.configuration);

export const getCamfilSettings = createSelector(getConfigurationState, state => {
  const { channelCode } = state;
  const countryCodeObject = {};

  if (channelCode) {
    countryCodeObject[channelCode] = true;
  }

  return Object.entries(state)
    .map(([key, value]) => {
      if (isBoolean(value)) {
        return { [key]: value };
      }
    })
    .filter(Boolean)
    .reduce((acc, val) => ({ ...acc, ...val, ...countryCodeObject }), {});
});

export const isCamfilConfigurationInitialized = createSelector(getConfigurationState, state => state.initialized);

export const getCamfilConfigurationParameter = <T, O extends string>(path: O) =>
  createSelector(
    getConfigurationState,
    (state): T =>
      path
        .split('.')
        .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), state as unknown) as T
  );

export const getLanguages = createSelector(getConfigurationState, state => state.languages);

export const getChannelCode = createSelector(getConfigurationState, state => state.channelCode);

export const getCurrency = createSelector(getConfigurationState, state => state.currency);

export const getICMChannel = createSelector(getConfigurationState, state => state.icmChannel);

export const getContinueShoppingUrl = createSelector(getConfigurationState, state => state.continueShoppingUrl);
