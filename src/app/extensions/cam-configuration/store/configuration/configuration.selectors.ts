import { createSelector } from '@ngrx/store';

import { getCamConfigurationState } from '../cam-configuration-store';

import { initialState } from './configuration.reducer';

const getConfigurationState = createSelector(getCamConfigurationState, state =>
  state ? state.configuration : initialState
);

const getCamfilConfiguration = createSelector(getConfigurationState, state => state);

export const isCamfilConfigurationInitialized = createSelector(getCamfilConfiguration, state => state.initialized);

export const getCamfilConfigurationParameter = <T>(path: string) =>
  createSelector(
    getCamfilConfiguration,
    (serverConfig): T =>
      path
        .split('.')
        .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), serverConfig as unknown) as T
  );
