import { createSelector } from '@ngrx/store';

import { getCamConfigurationState } from '../cam-configuration-store';

import { initialState } from './configuration.reducer';

const getConfigurationState = createSelector(getCamConfigurationState, state =>
  state ? state.configuration : initialState
);

const getCamfilConfiguration = createSelector(getConfigurationState, state => state?.configuration);

export const isCamfilConfigurationLoaded = createSelector(getCamfilConfiguration, configuration => !!configuration);

export const getCamfilConfigurationParameter = <T>(path: string) =>
  createSelector(
    getCamfilConfiguration,
    (serverConfig): T =>
      path
        .split('.')
        .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), serverConfig as unknown) as T
  );
