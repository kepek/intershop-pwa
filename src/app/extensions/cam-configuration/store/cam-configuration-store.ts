import { createFeatureSelector } from '@ngrx/store';

import { ConfigurationState } from './configuration/configuration.reducer';

export interface CamConfigurationState {
  configuration: ConfigurationState;
}

export const getCamConfigurationState = createFeatureSelector<CamConfigurationState>('camConfiguration');
