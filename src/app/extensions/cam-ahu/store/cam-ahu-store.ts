import { createFeatureSelector } from '@ngrx/store';

export interface CamAhuState {}

export const getCamAhuState = createFeatureSelector<CamAhuState>('camAhu');
