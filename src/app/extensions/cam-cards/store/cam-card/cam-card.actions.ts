import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import {
  CamCard,
  CamCardAddress,
  CamCardContact,
  CamCardCustomer,
  CamCardItem,
  CamCardItemComment,
  CamCardMeasurement,
} from '../../models/cam-card/cam-card.model';

export const loadCamCards = createAction('[Cam Cards Internal] Load Cam Cards');

export const loadCamCardsSuccess = createAction(
  '[Cam Cards API] Load Cam Cards Success',
  payload<{ camCards: CamCard[] }>()
);

export const loadCamCardsFail = createAction('[Cam Cards API] Load Cam Cards Fail', httpError());

export const createCamCard = createAction('[Cam Cards] Create Cam Card', payload<{ camCards: CamCard }>());

export const createVirtualCamCard = createAction(
  '[Cam Cards] Create Virtual Cam Card',
  payload<{ camCard: CamCard }>()
);

export const createVirtualCamCardSuccess = createAction(
  '[Cam Cards] Create Virtual Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const createVirtualCamCardFail = createAction('[Cam Cards] Create Virtual Cam Card Fail');

export const clearVirtualCamCard = createAction('[Cam Cards] Clear Virtual Cam Card');

export const createSubCamCard = createAction(
  '[Cam Cards] Create Sub Cam Card',
  payload<{ subCamCard: CamCard; rootCamCardId: string }>()
);

export const loadCamCard = createAction('[Cam Cards API] Load Cam Card', payload<{ camCardId: string }>());

export const loadCamCardSuccess = createAction(
  '[Cam Cards API] Load Cam Card Success',
  payload<{ camCard: CamCard }>()
);

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

export const cloneAndEditCamCard = createAction(
  '[Cam Cards API] Clone And Update Cam Card',
  payload<{ camCardId: string; camCardName: string }>()
);

export const cloneAndEditFail = createAction('[Cam Cards API] Clone And Update Cam Card Fail', httpError());

export const updateSubCamCardFail = createAction('[Cam Cards API] Update Sub Cam Card Fail', httpError());

export const updateSubCamCard = createAction('[Cam Cards] Update Sub Cam Card', payload<{ sub: CamCard }>());

export const updateSubCamCardSuccess = createAction(
  '[Cam Cards API] Update Sub Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const updateCamCardFail = createAction('[Cam Cards API] Update Cam Card Fail', httpError());

export const deleteCamCard = createAction('[Cam Cards] Delete Cam Card', payload<{ camCardId: string }>());

export const deleteCamCardSuccess = createAction(
  '[Cam Cards API] Delete Cam Card Success',
  payload<{ camCardId: string }>()
);

export const deleteCamCardFail = createAction('[Cam Cards API] Delete Cam Card Fail', httpError());

export const deleteSubCamCard = createAction(
  '[Cam Cards] Delete Sub Cam Card',
  payload<{ rootId: string; id: string }>()
);

export const deleteSubCamCardSuccess = createAction(
  '[Cam Cards API] Delete Sub Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const deleteSubCamCardFail = createAction('[Cam Cards API] Delete Sub Cam Card Fail', httpError());

export const loadCustomers = createAction('[Cam Cards] load available customers');

export const loadCustomersSuccess = createAction(
  '[Cam Cards API] load available customers Success',
  payload<{ customers: CamCardCustomer[] }>()
);

export const loadCustomersFail = createAction('[Cam Cards API] load available customers Fail', httpError());

export const loadContactsByCustomer = createAction(
  '[Cam Cards] load Contacts by customer',
  payload<{ customerId: string }>()
);

export const loadContactsByCustomerSuccess = createAction(
  '[Cam Cards API] load Contacts by customer Success',
  payload<{ customerId: string; contacts: CamCardContact[] }>()
);

export const loadContactsByCustomerFail = createAction('[Cam Cards API] load Contacts by customer Fail', httpError());

export const loadUserContactForCustomers = createAction(
  '[Cam Cards] load User Contact for all User customers',
  payload<{ customers: CamCardCustomer[] }>()
);

export const loadUserContactForCustomer = createAction(
  '[Cam Cards] load User Contact for customer',
  payload<{ customerId: string; userKey?: string }>()
);

export const loadUserContactForCustomerSuccess = createAction(
  '[Cam Cards API] load User Contact for customer Success',
  payload<{ customerId: string; contact: CamCardContact }>()
);

export const loadUserContactForCustomerFail = createAction(
  '[Cam Cards API] load User Contact for customer Fail',
  httpError()
);

export const loadDeliveryAddresses = createAction('[Cam Cards] load available addresses', payload<{ id: string }>());

export const loadDeliveryAddressesSuccess = createAction(
  '[Cam Cards API] load available addressses Success',
  payload<{ addresses: CamCardAddress[] }>()
);

export const loadDeliveryAddressesFail = createAction('[Cam Cards API] load available addresses Fail', httpError());

export const copyCamCard = createAction('[Cam Cards] copy CamCard', payload<{ camCardId: string; name: string }>());

export const copyCamCardFail = createAction('[Cam Cards API] copy Cam Card Fail', httpError());

export const addProductToCamCard = createAction(
  '[Cam Cards] Add Item to Cam Card',
  payload<{
    camCardId: string;
    sku: string;
    quantity?: number;
    position?: number;
    comment?: CamCardItemComment;
    measurement?: CamCardMeasurement;
    showSuccessToast?: boolean;
  }>()
);

export const addProductToSubCamCard = createAction(
  '[Cam Cards] Add Item to Sub Cam Card',
  payload<{
    camCardId: string;
    refreshCamCardId: string;
    sku: string;
    quantity?: number;
    boxLabel?: string;
    measurement?: CamCardMeasurement;
  }>()
);

export const addProductToNewSubCamCard = createAction(
  '[Cam Cards] Add Product To New Sub Cam Card',
  payload<{
    subCamCard: CamCard;
    rootCamCard: CamCard;
    sku: string;
    quantity?: number;
    boxLabel?: string;
    measurement?: CamCardMeasurement;
    edit?: boolean;
  }>()
);

export const updateCamCardProduct = createAction(
  '[Cam Cards] Update Cam Card Product',
  payload<{ rootCamCard: string; camCardId: string; camCardItem: CamCardItem; forceUpdateCamCard?: boolean }>()
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

export const addToNewCamCardWithNewSubCamCard = createAction(
  '[Cam Cards Internal] Add To New Cam Card With New Sub Cam Card',
  payload<{
    newCamCard: CamCard;
    newSubCamCard: CamCard;
    sku: string;
    quantity?: number;
    boxLabel?: string;
    measurement?: CamCardMeasurement;
    edit?: boolean;
  }>()
);

export const addProductToNewCamCardAndEdit = createAction(
  '[Cam Cards Internal] Add Product To Cam Card And Update',
  payload<{
    camCard: CamCard;
    sku: string;
    quantity?: number;
    boxLabel?: string;
    measurement?: CamCardMeasurement;
    edit?: boolean;
  }>()
);

export const createAndUpdateCamCardSuccess = createAction(
  '[Cam Cards Internal] Set created cam card',
  payload<{ name: string; id: string }>()
);

export const resetCreatedCamCard = createAction('[Cam Cards Internal] Reset cam card');

export const editCamCard = createAction('[Cam Cards Internal] Edit Cam Card', payload<{ camCardId?: string }>());

export const loadCamCardsEdit = createAction('[Cam Card Internal] Load Cam Cards Edit');

export const updateCamCardContacts = createAction(
  '[Cam Cards] Update Cam Card Contacts',
  payload<{ camCardId: string; camCardContacts: CamCardContact[] }>()
);

export const updateCamCardContactsSuccess = createAction(
  '[Cam Cards API] Update Cam Card Contacts Success',
  payload<{ camCardId: string; contacts: CamCardContact[] }>()
);

export const updateCamCardContactsFail = createAction('[Cam Cards API] Update Cam Card contacts Fail', httpError());

export const moveItemToCamCard = createAction(
  '[Cam Cards] Move Item to another Cam Card',
  payload<{
    source: { id: string; camCardItemId: string };
    target: { id?: string; name?: string; sku: string; quantity: number };
  }>()
);

export const removeItemFromCamCard = createAction(
  '[Cam Cards] Remove Item from Cam Card',
  payload<{ camCardId: string; camCardItemId: string; rootCamCard?: string }>()
);

export const removeItemFromCamCardSuccess = createAction(
  '[Cam Cards API] Remove Item from Cam Card Success',
  payload<{ camCard: CamCard }>()
);

export const resetCamCardItemPositions = createAction(
  '[Cam Cards API] Preset Positions of all Cam Card Items',
  payload<{ camCard: CamCard }>()
);

export const resetCamCardItemPositionsSuccess = createAction(
  '[Cam Cards API] Preset Positions of all Cam Card Items Success',
  payload<{ camCard: CamCard; camCardItems: CamCardItem[] }>()
);

export const resetCamCardItemPositionsFail = createAction(
  '[Cam Cards API] Preset Positions of all Cam Card Items Fail',
  httpError()
);

export const moveCamCard = createAction(
  '[Cam Cards] move Cam Card',
  payload<{ camCardId: string; newCustomerId: string; newContacts: CamCardContact[] }>()
);

export const moveCamCardSuccess = createAction(
  '[Cam Cards API] move Cam Card Success',
  payload<{ camCard: CamCard; newContacts: CamCardContact[] }>()
);

export const moveCamCardFail = createAction('[Cam Cards API] move Cam Card Fail', httpError());

export const moveCamCardItem = createAction(
  '[Cam Cards] Move CamCardItem',
  payload<{
    source: { id: string; camCardItem: CamCardItem };
    target: { id?: string; position?: number };
  }>()
);

export const moveCamCardItemSuccess = createAction(
  '[Cam Cards API] move CamCardItem Success',
  payload<{
    sourceCamCard: CamCard;
    targetCamCard: CamCard;
  }>()
);

export const moveCamCardItemFail = createAction('[Cam Cards API] move CamCardItem Fail', httpError());

export const updateContactsWhileMoveCamCardFail = createAction(
  '[Cam Cards API] updating contacts while moving Cam Card Fail',
  httpError()
);

export const removeItemFromCamCardFail = createAction('[Cam Cards API] Remove Item from Cam Card Fail', httpError());

export const selectCamCard = createAction('[Cam Cards Internal] Select Cam Card', payload<{ id: string }>());

export const unselectCamCard = createAction('[Cam Cards Internal] Unselect Cam Card');

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

export const validateCamCardImport = createAction('[Cam Cards] Validate Cam Card Import', payload<{ camCardData: {} }>());

export const validateCamCardImportSuccess = createAction('[Cam Cards API] Validate Cam Card Import Success', payload<{ camCardData }>());

export const validateCamCardImportFail = createAction('[Cam Cards API] Validate Cam Card Import Fail', httpError());


export const importCamCard = createAction('[Cam Cards] Import Cam Card', payload<{ camCardData: {} }>());

export const importCamCardSuccess = createAction('[Cam Cards API] Import Cam Card Success', payload<{ camCardData }>());

export const importCamCardFail = createAction('[Cam Cards API] Import Cam Card Fail', httpError());
