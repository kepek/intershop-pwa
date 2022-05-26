import { createReducer, on } from '@ngrx/store';
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  applyCamfilConfiguration,
  loadCamfilConfiguration,
  loadCamfilConfigurationFail,
  loadCamfilConfigurationSuccess,
} from './camfil-configuration.actions';

export interface CamfilConfigurationState extends CamfilChannelConfiguration {
  initialized: boolean;
  loading: boolean;
  error: HttpError;
}

export const initialState: CamfilConfigurationState = {
  initialized: false,
  loading: false,
  error: undefined,
  languages: undefined,
  channelCode: undefined,
  currency: undefined,
  icmChannel: undefined,
  continueShoppingUrl: undefined,
  zipCodeRegExp: undefined,
  bucketSurchargeOrder: undefined,
  basketSurchargeOrder: undefined,
};

export const camfilConfigurationReducer = createReducer(
  initialState,
  setLoadingOn(loadCamfilConfiguration),
  setErrorOn(loadCamfilConfigurationFail),
  unsetLoadingAndErrorOn(loadCamfilConfigurationSuccess),
  on(loadCamfilConfigurationSuccess, state => ({ ...state, initialized: true })),
  on(loadCamfilConfigurationSuccess, (state, action) => ({
    ...state,
    ...action.payload.configuration,
  })),
  on(applyCamfilConfiguration, (state: CamfilConfigurationState, action) => ({
    ...state,
    ...action.payload,
  }))
);
