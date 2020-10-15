import { createFeatureSelector } from '@ngrx/store';

export interface CamDemoState {}

export const getCamDemoState = createFeatureSelector<CamDemoState>('camDemo');
