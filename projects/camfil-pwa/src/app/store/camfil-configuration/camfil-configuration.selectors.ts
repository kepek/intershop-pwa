import { createSelector } from '@ngrx/store';
import { getCamfilPwaState } from 'camfil-pwa/store/camfil-pwa-store';
import { isBoolean } from 'lodash-es';

export const getCamfilConfigurationState = createSelector(getCamfilPwaState, state => state.camfilConfiguration);

export const getCamfilSettings = createSelector(getCamfilConfigurationState, state => {
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

export const isCamfilConfigurationInitialized = createSelector(getCamfilConfigurationState, state => state.initialized);

export const getCamfilConfigurationParameter = <T, O extends string>(path: O) =>
  createSelector(
    getCamfilSettings,
    (state): T =>
      path
        .split('.')
        .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), state as unknown) as T
  );

export const getLanguages = createSelector(getCamfilConfigurationState, state => state.languages);

export const getChannelCode = createSelector(getCamfilConfigurationState, state => state.channelCode);

export const getCurrency = createSelector(getCamfilConfigurationState, state => state.currency);

export const getICMChannel = createSelector(getCamfilConfigurationState, state => state.icmChannel);

export const getContinueShoppingUrl = createSelector(getCamfilConfigurationState, state => state.continueShoppingUrl);

export const getZipCodeRegExp = createSelector(getCamfilConfigurationState, state => state.zipCodeRegExp);
