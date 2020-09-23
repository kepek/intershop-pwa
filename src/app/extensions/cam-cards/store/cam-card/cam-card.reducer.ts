import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { CamCard } from '../../models/cam-card/cam-card.model';

import {
  addBasketToNewCamCard,
  addBasketToNewCamCardFail,
  addBasketToNewCamCardSuccess,
  addProductToCamCardSuccess,
  createCamCard,
  createCamCardFail,
  createCamCardSuccess,
  deleteCamCard,
  deleteCamCardFail,
  deleteCamCardSuccess,
  loadCamCards,
  loadCamCardsFail,
  loadCamCardsSuccess,
  removeItemFromCamCardSuccess,
  selectCamCard,
  updateCamCard,
  updateCamCardFail,
  updateCamCardSuccess,
} from './cam-card.actions';

export interface CamCardState extends EntityState<CamCard> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const camCardAdapter = createEntityAdapter<CamCard>({
  selectId: camCard => camCard.id,
});

export const initialState: CamCardState = camCardAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const camCardReducer = createReducer(
  initialState,
  setLoadingOn(loadCamCards, createCamCard, addBasketToNewCamCard, deleteCamCard, updateCamCard),
  on(
    loadCamCardsFail,
    deleteCamCardFail,
    createCamCardFail,
    addBasketToNewCamCardFail,
    updateCamCardFail,
    (state: CamCardState, action) => {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
        selected: undefined,
      };
    }
  ),
  on(loadCamCardsSuccess, (state: CamCardState, action) => {
    const { camCards } = action.payload;
    return camCardAdapter.setAll(camCards, {
      ...state,
      loading: false,
    });
  }),
  on(
    addBasketToNewCamCardSuccess,
    createCamCardSuccess,
    updateCamCardSuccess,
    addProductToCamCardSuccess,
    removeItemFromCamCardSuccess,
    (state: CamCardState, action) => {
      const { camCard } = action.payload;

      return camCardAdapter.upsertOne(camCard, {
        ...state,
        loading: false,
      });
    }
  ),
  on(deleteCamCardSuccess, (state: CamCardState, action) => {
    const { camCardId } = action.payload;
    return camCardAdapter.removeOne(camCardId, {
      ...state,
      loading: false,
    });
  }),
  on(selectCamCard, (state: CamCardState, action) => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  })
);
