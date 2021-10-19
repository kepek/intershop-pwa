import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  CamCard,
  CamCardContact,
  CamCardCustomer,
  CamCardCustomersAddresses,
  CamCardImportValidationResponse,
  CamCardItem,
} from '../../models/cam-card/cam-card.model';

import {
  addBasketToNewCamCard,
  addBasketToNewCamCardFail,
  addBasketToNewCamCardSuccess,
  addProductToCamCard,
  addProductToCamCardSuccess,
  checkCamCardsInBasketsForAllUsers,
  checkCamCardsInBasketsForAllUsersFail,
  checkCamCardsInBasketsForAllUsersSuccess,
  clearVirtualCamCard,
  copyCamCard,
  copyCamCardFail,
  createCamCard,
  createCamCardFail,
  createCamCardSuccess,
  createVirtualCamCardSuccess,
  deleteCamCard,
  deleteCamCardFail,
  deleteCamCardSuccess,
  deleteSubCamCard,
  deleteSubCamCardFail,
  deleteSubCamCardSuccess,
  importCamCard,
  importCamCardFail,
  importCamCardSuccess,
  loadCamCardSuccess,
  loadCamCards,
  loadCamCardsFail,
  loadCamCardsSuccess,
  loadContactsByCustomer,
  loadContactsByCustomerFail,
  loadContactsByCustomerSuccess,
  loadCustomers,
  loadCustomersFail,
  loadCustomersSuccess,
  loadDeliveryAddresses,
  loadDeliveryAddressesFail,
  loadDeliveryAddressesSuccess,
  loadUserContactForCustomer,
  loadUserContactForCustomerFail,
  loadUserContactForCustomerSuccess,
  moveCamCardItem,
  moveCamCardItemSuccess,
  moveCamCardSuccess,
  moveItemToCamCard,
  removeItemFromCamCardSuccess,
  resetCamCardItemPositionsSuccess,
  selectCamCard,
  setStickyCamCardToolbar,
  unselectCamCard,
  updateCamCard,
  updateCamCardAttribute,
  updateCamCardAttributeFail,
  updateCamCardAttributeSuccess,
  updateCamCardContactsSuccess,
  updateCamCardFail,
  updateCamCardProductSuccess,
  updateCamCardSuccess,
  updateSubCamCard,
  updateSubCamCardFail,
  updateSubCamCardSuccess,
  validateCamCardImport,
  validateCamCardImportFail,
  validateCamCardImportSuccess,
} from './cam-card.actions';

export interface CamCardState extends EntityState<CamCard> {
  loading: boolean;
  camCardsLoading: boolean;
  selected: string;
  error: HttpError;
  stickyToolbar: boolean;
  customers: CamCardCustomer[];
  addProductSuccess: boolean;
  contacts: {
    [key: string]: CamCardContact[];
  };
  userContact: {
    [key: string]: CamCardContact[];
  };
  addresses?: CamCardCustomersAddresses;
  virtualCamCard: CamCard;
  camCardsInBasketsForAllUsers: {
    loading: boolean;
    list?: string[];
  };
  validationErrors: HttpError;
  validationResponse: CamCardImportValidationResponse;
}

export const camCardAdapter = createEntityAdapter<CamCard>({
  selectId: camCard => camCard.id,
});

export const initialState: CamCardState = camCardAdapter.getInitialState({
  loading: false,
  camCardsLoading: false,
  selected: undefined,
  error: undefined,
  customers: [],
  addProductSuccess: false,
  contacts: {},
  userContact: {},
  addresses: {},
  stickyToolbar: false,
  virtualCamCard: undefined,
  camCardsInBasketsForAllUsers: { loading: false },
  validationErrors: undefined,
  validationResponse: undefined,
});

/** Returns a new state with replaced camcard or subcamcard */
function insertCamCard(state, camCard) {
  const entities = state.entities;
  const oldSubs = entities[camCard.rootCamCard]?.subCamCards || [];
  const oldSub = oldSubs.find(sub => sub.id === camCard.id);
  let items: CamCard[] | CamCardItem[] = camCard.camCardItems;
  if (camCard.rootCamCard) {
    const newSub = { ...oldSub, camCardItems: items };
    items = [...oldSubs].map(sub => (sub.id === camCard.id ? newSub : sub));
  }

  const prop = camCard.rootCamCard ? 'subCamCards' : 'camCardItems';

  return {
    ...state,
    entities: {
      ...state.entities,
      [camCard.rootCamCard || camCard.id]: {
        ...state.entities[camCard.rootCamCard || camCard.id],
        [prop]: items,
      },
    },
  };
}

export const camCardReducer = createReducer(
  initialState,
  setLoadingOn(
    loadCamCards,
    copyCamCard,
    createCamCard,
    addBasketToNewCamCard,
    deleteCamCard,
    deleteSubCamCard,
    updateCamCard,
    updateCamCardAttribute,
    loadCustomers,
    loadContactsByCustomer,
    loadUserContactForCustomer,
    loadDeliveryAddresses,
    updateSubCamCard,
    moveItemToCamCard,
    moveCamCardItem,
    importCamCard,
    validateCamCardImport
  ),
  on(
    loadCamCardsFail,
    copyCamCardFail,
    deleteCamCardFail,
    deleteSubCamCardFail,
    createCamCardFail,
    addBasketToNewCamCardFail,
    updateCamCardFail,
    updateCamCardAttributeFail,
    loadCustomersFail,
    loadContactsByCustomerFail,
    loadUserContactForCustomerFail,
    loadDeliveryAddressesFail,
    updateSubCamCardFail,
    importCamCardFail,
    validateCamCardImportFail,
    checkCamCardsInBasketsForAllUsersFail,
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
  on(loadCamCards, (state: CamCardState) => ({
    ...state,
    camCardsLoading: true,
  })),
  on(loadCamCardsSuccess, (state: CamCardState, action) => {
    const { camCards } = action.payload;
    return camCardAdapter.setAll(camCards, {
      ...state,
      loading: false,
      camCardsLoading: false,
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
  on(loadContactsByCustomerSuccess, (state: CamCardState, action) => {
    const { customerId, contacts } = action.payload;
    return {
      ...state,
      contacts: { ...state.contacts, [customerId]: contacts },
    };
  }),
  on(loadUserContactForCustomerSuccess, (state: CamCardState, action) => {
    const { customerId, contact } = action.payload;
    return {
      ...state,
      userContact: { ...state.userContact, [customerId]: contact },
      loading: false,
    };
  }),
  on(loadDeliveryAddressesSuccess, (state: CamCardState, action) => {
    const { addresses, customerId } = action.payload;
    return {
      ...state,
      addresses: {
        ...state.addresses,
        [customerId]: addresses,
      },
      loading: false,
    };
  }),
  on(loadDeliveryAddressesFail, (state: CamCardState) => ({
    ...state,
    loading: false,
  })),
  on(
    loadCamCardSuccess,
    addBasketToNewCamCardSuccess,
    createCamCardSuccess,
    updateCamCardSuccess,
    updateSubCamCardSuccess,
    deleteSubCamCardSuccess,
    moveCamCardSuccess,
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
  on(updateCamCardAttributeSuccess, (state: CamCardState, action) => {
    const { camCard } = action.payload;
    return camCardAdapter.updateOne(
      {
        id: camCard.id,
        changes: camCard,
      },
      { ...state, loading: false }
    );
  }),
  on(addProductToCamCard, (state: CamCardState) => ({
    ...state,
    addProductSuccess: false,
  })),
  on(addProductToCamCardSuccess, (state: CamCardState) => ({
    ...state,
    addProductSuccess: true,
  })),
  on(deleteCamCardSuccess, (state: CamCardState, action) => {
    const { camCardId } = action.payload;
    return camCardAdapter.removeOne(camCardId, {
      ...state,
      loading: false,
    });
  }),
  on(updateCamCardProductSuccess, (state: CamCardState, action) => {
    const { rootCamCard, camCardId, camCardItem } = action.payload;
    const entities = state.entities;
    const oldSubs = entities[rootCamCard]?.subCamCards || [];
    const oldSub = oldSubs.find(sub => sub.id === camCardId);
    const oldItems = rootCamCard ? [...oldSub.camCardItems] : [...entities[camCardId].camCardItems];

    const newCamCardItem = camCardItem?.measurement.hasOwnProperty('valid')
      ? camCardItem
      : {
          ...camCardItem,
          measurement: {
            ...camCardItem.measurement,
            valid: true,
          },
        };
    let items: CamCard[] | CamCardItem[] = oldItems.map(item =>
      item.id === newCamCardItem.id ? newCamCardItem : item
    );

    if (rootCamCard) {
      const newSub = { ...oldSub, camCardItems: items };
      items = [...oldSubs].map(sub => (sub.id === camCardId ? newSub : sub));
    }

    const prop = rootCamCard ? 'subCamCards' : 'camCardItems';

    return {
      ...state,
      entities: {
        ...entities,
        [rootCamCard || camCardId]: {
          ...entities[rootCamCard || camCardId],
          [prop]: items,
        },
      },
      loading: false,
    };
  }),

  on(moveCamCardItemSuccess, (state: CamCardState, action) => {
    const { sourceCamCard, targetCamCard } = action.payload;

    if (!sourceCamCard || !targetCamCard) {
      return {
        ...state,
      };
    }

    return {
      ...insertCamCard(insertCamCard(state, targetCamCard), sourceCamCard),
      loading: false,
    };
  }),

  on(resetCamCardItemPositionsSuccess, (state: CamCardState, action) => {
    const { camCard, camCardItems } = action.payload;
    const updatedCamcard: CamCard = { ...camCard, camCardItems };
    return insertCamCard(state, updatedCamcard);
  }),

  on(updateCamCardContactsSuccess, (state: CamCardState, action) => {
    const { camCardId, contacts } = action.payload;
    return {
      ...state,
      loading: false,
      entities: {
        ...state.entities,
        [camCardId]: {
          ...state.entities[camCardId],
          contacts,
        },
      },
    };
  }),
  on(unselectCamCard, (state: CamCardState) => ({
    ...state,
    selected: undefined,
  })),
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
  })),
  on(createVirtualCamCardSuccess, (state: CamCardState, action) => ({
    ...state,
    virtualCamCard: action.payload.camCard,
  })),
  on(clearVirtualCamCard, (state: CamCardState) => ({
    ...state,
    virtualCamCard: undefined,
  })),
  on(validateCamCardImportSuccess, (state: CamCardState, action) => {
    const { validationResponse } = action.payload;
    return {
      ...state,
      loading: false,
      validationResponse: validationResponse[0],
    };
  }),
  on(importCamCardSuccess, (state: CamCardState, action) => {
    const { camCardData } = action.payload;
    const importedCamCard = camCardData.elements[0];
    const itemsCount = importedCamCard.camCardItems?.length;
    const camCardObj = {
      ...importedCamCard,
      itemsCount,
    };
    return camCardAdapter.upsertOne(camCardObj, {
      ...state,
      loading: false,
    });
  }),
  on(checkCamCardsInBasketsForAllUsers, (state: CamCardState) => ({
    ...state,
    camCardsInBasketsForAllUsers: { loading: true },
  })),
  on(checkCamCardsInBasketsForAllUsersSuccess, (state: CamCardState, action) => {
    const { camCardsId } = action.payload;
    return {
      ...state,
      camCardsInBasketsForAllUsers: { loading: false, list: camCardsId },
    };
  })
);
