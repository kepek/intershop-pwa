import { createFeatureSelector } from '@ngrx/store';

import { CamCardState } from './cam-card/cam-card.reducer';

export interface CamCardsState {
  camCards: CamCardState;
}

export const getCamCardsState = createFeatureSelector<CamCardsState>('camCards');
