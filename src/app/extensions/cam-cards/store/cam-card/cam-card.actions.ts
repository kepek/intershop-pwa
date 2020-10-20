import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

export const loadCamCards = createAction('[Cam Cards Internal] Load Cam Cards');

export const loadCamCardsSuccess = createAction(
  '[Cam Cards API] Load Cam Cards Success',
  payload<{ camCards: CamCard[] }>()
);

export const loadCamCardsFail = createAction('[Cam Cards API] Load Cam Cards Fail', httpError());

export const createCamCard = createAction('[Cam Cards] Create Cam Card', payload<{ camCards: CamCard }>());

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

export const loadCustomers = createAction('[Cam Cards] load available customer', payload<boolean>());

export const loadCustomersSuccess = createAction(
  '[Cam Cards API] load available customer Success',
  payload<{ customers: [] }>()
);

export const loadCustomersdFail = createAction('[Cam Cards API] load available customer Fail', httpError());

export const addProductToCamCard = createAction(
  '[Cam Cards] Add Item to Cam Card',
  payload<{ camCardId: string; sku: string; quantity?: number }>()
);

export const updateCamCardProduct = createAction(
  '[Cam Cards] Update Cam Card Product',
  payload<{ rootCamCard: string; camCardId: string; camCardItem: CamCardItem }>()
);

export const updateCamCardProductSuccess = createAction(
  '[Cam Cards API] Update Cam Card Product Success',
  payload<{ rootCamCard: string; camCardId: string; camCardItem: CamCardItem }>()
);

export const addProductToCamCardSuccess = createAction(
  '[Cam Cards API] Add Item to Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const addProductToCamCardFail = createAction('[Cam Cards API] Add Item to Cam Card Fail', httpError());

export const addProductToNewCamCard = createAction(
  '[Cam Cards Internal] Add Product To New Cam Card',
  payload<{ name: string; sku: string; quantity?: number }>()
);

export const moveItemToCamCard = createAction(
  '[Cam Cards] Move Item to another Cam Card',
  payload<{
    source: { id: string; camCardItemId: string };
    target: { id?: string; name?: string; sku: string; quantity: number };
  }>()
);

export const removeItemFromCamCard = createAction(
  '[Cam Cards] Remove Item from Cam Card',
  payload<{ camCardId: string; camCardItemId: string }>()
);

export const removeItemFromCamCardSuccess = createAction(
  '[Cam Cards API] Remove Item from Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const removeItemFromCamCardFail = createAction('[Cam Cards API] Remove Item from Cam Card Fail', httpError());

export const selectCamCard = createAction('[Cam Cards Internal] Select Cam Card', payload<{ id: string }>());

export const addBasketToNewCamCard = createAction(
  '[Cam Cards] Add basket to New Cam Card]',
  payload<{ camCards: CamCard }>()
);

export const addBasketToNewCamCardFail = createAction('[Cam Cards API] Add basket to New Cam Card Fail]', httpError());

export const addBasketToNewCamCardSuccess = createAction(
  '[Cam Cards API] Add basket to New Cam Card Success]',
  payload<{ camCard: CamCard }>()
);

export const detectCamCardToolbar = createAction('[Cam Cards API] Detect Cam Card toolbar');

export const setStickyCamCardToolbar = createAction(
  '[Cam Cards API] Set Sticky Toolbar',
  payload<{ sticky: boolean }>()
);
