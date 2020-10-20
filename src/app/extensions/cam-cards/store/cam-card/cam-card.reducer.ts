import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

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
  loadCustomers,
  loadCustomersSuccess,
  loadCustomersdFail,
  removeItemFromCamCardSuccess,
  selectCamCard,
  setStickyCamCardToolbar,
  updateCamCard,
  updateCamCardFail,
  updateCamCardProductSuccess,
  updateCamCardSuccess,
} from './cam-card.actions';

export interface CamCardState extends EntityState<CamCard> {
  loading: boolean;
  selected: string;
  error: HttpError;
  stickyToolbar: boolean;
  customers: [];
}

export const camCardAdapter = createEntityAdapter<CamCard>({
  selectId: camCard => camCard.id,
});

const updateCamCardItem = (camCard: CamCard, camCardItem: CamCardItem) => {
  camCard.camCardItems.map((item: CamCardItem) => (item.id === camCardItem.id ? camCardItem : item));
};

export const initialState: CamCardState = camCardAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
  customers: [],
  stickyToolbar: false,
});

export const camCardReducer = createReducer(
  initialState,
  setLoadingOn(loadCamCards, createCamCard, addBasketToNewCamCard, deleteCamCard, updateCamCard, loadCustomers),
  on(
    loadCamCardsFail,
    deleteCamCardFail,
    createCamCardFail,
    addBasketToNewCamCardFail,
    updateCamCardFail,
    loadCustomersdFail,
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
  on(loadCustomersSuccess, (state: CamCardState, action) => {
    const { customers } = action.payload;
    return {
      ...state,
      customers,
      loading: false,
    };
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
  on(updateCamCardProductSuccess, (state: CamCardState, action) => {
    const { rootCamCard, camCardId, camCardItem } = action.payload;
    if (rootCamCard) {
      state.entities[rootCamCard].subCamCards.map(sub =>
        sub.id === camCardId ? updateCamCardItem(sub, camCardItem) : sub
      );
    } else {
      updateCamCardItem(state.entities[camCardId], camCardItem);
    }
    return {
      ...state,
      loading: false,
    };
  }),
  on(selectCamCard, (state: CamCardState, action) => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  }),
  on(setStickyCamCardToolbar, (state: CamCardState, action) => ({
    ...state,
    stickyToolbar: action.payload.sticky,
  }))
);
