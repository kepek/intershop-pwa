import { createAction } from '@ngrx/store';

import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CamfilConfigurationState } from './camfil-configuration.reducer';

type ConfigurationType = Partial<CamfilConfigurationState>;

export const loadCamfilConfiguration = createAction('[Camfil Configuration Internal] Get the Camfil configuration');

export const loadCamfilConfigurationSuccess = createAction(
  '[Camfil Configuration API] Get the Camfil configuration Success',
  payload<{ configuration: ServerConfig }>()
);

export const loadCamfilConfigurationFail = createAction(
  '[Camfil Configuration API] Get the Camfil configuration Fail',
  httpError()
);

export const applyCamfilConfiguration = createAction(
  '[Camfil Configuration Internal] Apply Configuration',
  payload<ConfigurationType>()
);
