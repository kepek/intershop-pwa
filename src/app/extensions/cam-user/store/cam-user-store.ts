import { createFeatureSelector } from '@ngrx/store';

export interface CamUserState {}

export const getCamUserState = createFeatureSelector<CamUserState>('camUser');
