import { createAction } from '@ngrx/store';

import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCamfilConfiguration = createAction('[Camfil Configuration Internal] Get the Camfil configuration');

export const loadCamfilConfigurationSuccess = createAction(
  '[Camfil Configuration API] Get the Camfil configuration Success',
  payload<{ configuration: ServerConfig }>()
);

export const loadCamfilConfigurationFail = createAction(
  '[Camfil Configuration API] Get the Camfil configuration Fail',
  httpError()
);
