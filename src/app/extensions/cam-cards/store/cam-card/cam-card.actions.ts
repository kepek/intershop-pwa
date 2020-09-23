import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CamCard, CamCardHeader } from '../../models/cam-card/cam-card.model';

export const loadCamCards = createAction('[Cam Cards Internal] Load Cam Cards');

export const loadCamCardsSuccess = createAction(
  '[Cam Cards API] Load Cam Cards Success',
  payload<{ camCards: CamCard[] }>()
);

export const loadCamCardsFail = createAction('[Cam Cards API] Load Cam Cards Fail', httpError());

export const createCamCard = createAction('[Cam Cards] Create Cam Card', payload<{ camCards: CamCardHeader }>());

export const createCamCardSuccess = createAction(
  '[Cam Cards API] Create Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const createCamCardFail = createAction('[Cam Cards API] Create Cam Card Fail', httpError());

export const updateCamCard = createAction('[Cam Cards] Update Cam Card', payload<{ camCard: CamCard }>());

export const updateCamCardSuccess = createAction(
  '[Cam Cards API] Update Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const updateCamCardFail = createAction('[Cam Cards API] Update Cam Card Fail', httpError());

export const deleteCamCard = createAction('[Cam Cards] Delete Cam Card', payload<{ camCardId: string }>());

export const deleteCamCardSuccess = createAction(
  '[Cam Cards API] Delete Cam Card Success',
  payload<{ camCardId: string }>()
);

export const deleteCamCardFail = createAction('[Cam Cards API] Delete Cam Card Fail', httpError());

export const addProductToCamCard = createAction(
  '[Cam Cards] Add Item to Cam Card',
  payload<{ camCardId: string; sku: string; quantity?: number }>()
);

export const addProductToCamCardSuccess = createAction(
  '[Cam Cards API] Add Item to Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const addProductToCamCardFail = createAction('[Cam Cards API] Add Item to Cam Card Fail', httpError());

export const addProductToNewCamCard = createAction(
  '[Cam Cards Internal] Add Product To New Cam Card',
  payload<{ title: string; sku: string; quantity?: number }>()
);

export const moveItemToCamCard = createAction(
  '[Cam Cards] Move Item to another Cam Card',
  payload<{ source: { id: string }; target: { id?: string; title?: string; sku: string; quantity: number } }>()
);

export const removeItemFromCamCard = createAction(
  '[Cam Cards] Remove Item from Cam Card',
  payload<{ camCardId: string; sku: string }>()
);

export const removeItemFromCamCardSuccess = createAction(
  '[Cam Cards API] Remove Item from Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const removeItemFromCamCardFail = createAction('[Cam Cards API] Remove Item from Cam Card Fail', httpError());

export const selectCamCard = createAction('[Cam Cards Internal] Select Cam Card', payload<{ id: string }>());

export const addBasketToNewCamCard = createAction(
  '[Cam Cards] Add basket to New Cam Card]',
  payload<{ camCards: CamCardHeader }>()
);

export const addBasketToNewCamCardFail = createAction('[Cam Cards API] Add basket to New Cam Card Fail]', httpError());

export const addBasketToNewCamCardSuccess = createAction(
  '[Cam Cards API] Add basket to New Cam Card Success]',
  payload<{ camCard: CamCard }>()
);
