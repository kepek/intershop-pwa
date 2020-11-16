import { createReducer, on } from '@ngrx/store';

import { ServerConfig } from 'ish-core/models/server-config/server-config.model';

import { loadCamfilConfigurationSuccess } from './configuration.actions';

export interface ConfigurationState {
  configuration: ServerConfig;
}

export const initialState: ConfigurationState = {
  configuration: undefined,
};

export const configurationReducer = createReducer(
  initialState,
  on(loadCamfilConfigurationSuccess, (_, action) => ({
    configuration: action.payload.configuration,
  }))
);
