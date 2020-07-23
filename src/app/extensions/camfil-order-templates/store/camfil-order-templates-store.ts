import { createFeatureSelector } from '@ngrx/store';

export interface CamfilOrderTemplatesState {}

export const getCamfilOrderTemplatesState = createFeatureSelector<CamfilOrderTemplatesState>('camfilOrderTemplates');
