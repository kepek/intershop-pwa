import { createSelector } from '@ngrx/store';
import { isBoolean } from 'lodash-es';

import { getCamConfigurationState } from '../cam-configuration-store';

export const getConfigurationState = createSelector(getCamConfigurationState, state => state.configuration);

export const getCamfilSettings = createSelector(getConfigurationState, state => {
  const { countryCode } = state;
  const countryCodeObject = {};

  if (countryCode) {
    countryCodeObject[countryCode] = true;
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

export const getCamfilConfigurationParameter = <T>(path: string) =>
  createSelector(
    getConfigurationState,
    (serverConfig): T =>
      path
        .split('.')
        .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), serverConfig as unknown) as T
  );

export const getShowPricesForNonLoggedInUser = createSelector(
  getConfigurationState,
  state => state.showPricesForNonLoggedInUser
);

export const getCountryCode = createSelector(getConfigurationState, state => state.countryCode);

export const getUseSecondAddressLine = createSelector(getConfigurationState, state => state.useSecondAddressLine);

export const getContinueShoppingUrl = createSelector(getConfigurationState, state => state.continueShoppingUrl);
