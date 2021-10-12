import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  applyCamfilConfiguration,
  loadCamfilConfiguration,
  loadCamfilConfigurationFail,
  loadCamfilConfigurationSuccess,
} from './configuration.actions';

export interface ChannelConfiguration {
  countryCode: string;
  currency: string;
  icmChannel: string;
}

export interface ConfigurationState extends ChannelConfiguration {
  initialized: boolean;
  loading: boolean;
  error: HttpError;
}

export const initialState: ConfigurationState = {
  initialized: false,
  loading: false,
  error: undefined,
  countryCode: undefined,
  currency: undefined,
  icmChannel: undefined,
};

export const configurationReducer = createReducer(
  initialState,
  setLoadingOn(loadCamfilConfiguration),
  setErrorOn(loadCamfilConfigurationFail),
  unsetLoadingAndErrorOn(loadCamfilConfigurationSuccess),
  on(loadCamfilConfigurationSuccess, state => ({ ...state, initialized: true })),
  on(loadCamfilConfigurationSuccess, (state, action) => ({
    ...state,
    ...action.payload.configuration,
  })),
  on(applyCamfilConfiguration, (state: ConfigurationState, action) => ({
    ...state,
    ...action.payload,
  }))
);
