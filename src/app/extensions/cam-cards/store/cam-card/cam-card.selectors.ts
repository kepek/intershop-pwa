import { createSelector } from '@ngrx/store';

import { CamCard } from '../../models/cam-card/cam-card.model';
import { getCamCardsState } from '../cam-cards-store';

import { camCardAdapter, initialState } from './cam-card.reducer';

const getCamCardState = createSelector(getCamCardsState, state => (state ? state.camCards : initialState));

const { selectEntities, selectAll } = camCardAdapter.getSelectors(getCamCardState);

export const getAllCamCards = selectAll;

export const getCamCardLoading = createSelector(getCamCardState, state => state.loading);

export const getCamCardError = createSelector(getCamCardState, state => state.error);

export const getSelectedCamCardId = createSelector(getCamCardState, state => state.selected);

export const getSelectedCamCardDetails = createSelector(
  selectEntities,
  getSelectedCamCardId,
  (entities, id): CamCard => id && entities[id]
);

export const getCamCardDetails = createSelector(
  selectEntities,
  (entities, props: { id: string }): CamCard => props.id && entities[props.id]
);
