import { createFeatureSelector } from '@ngrx/store';

export interface CamfilState {}

export const getCamfilState = createFeatureSelector<CamfilState>('camfil');
