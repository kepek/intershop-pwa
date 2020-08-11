import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { ConfigurationState } from './configuration.reducer';

type ConfigurationType = Partial<ConfigurationState>;

export const applyConfiguration = createAction('[Configuration] Apply Configuration', payload<ConfigurationType>());

export const setGTMToken = createAction(
  '[Configuration] Set Google Tag Manager Token',
  payload<{ gtmToken: string }>()
);

export const setCurrentLocale = createAction('[Configuration] Set Current Locale', payload<{ lang: string }>());

export const hasSetCurrentLocale = createAction('[Configuration] Has Set Current Locale');
