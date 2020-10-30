import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  CamCard,
  CamCardContact,
  CamCardCustomer,
  CamCardDelivery,
  CamCardItem,
} from '../../models/cam-card/cam-card.model';

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
  loadContactsByCustomer,
  loadContactsByCustomerFail,
  loadContactsByCustomerSuccess,
  loadCustomers,
  loadCustomersSuccess,
  loadCustomersdFail,
  loadDeliveryAddresses,
  loadDeliveryAddressesFail,
  loadDeliveryAddressesSuccess,
  moveCamCardSuccess,
  removeItemFromCamCardSuccess,
  selectCamCard,
  setStickyCamCardToolbar,
  updateCamCard,
  updateCamCardContactsSuccess,
  updateCamCardFail,
  updateCamCardProductSuccess,
  updateCamCardSuccess,
} from './cam-card.actions';

export interface CamCardState extends EntityState<CamCard> {
  loading: boolean;
  selected: string;
  error: HttpError;
  stickyToolbar: boolean;
  customers: CamCardCustomer[];
  contacts: {
    [key: string]: CamCardContact[];
  };
  addresses?: CamCardDelivery[];
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
  contacts: {},
  addresses: [],
  stickyToolbar: false,
});

export const camCardReducer = createReducer(
  initialState,
  setLoadingOn(
    loadCamCards,
    createCamCard,
    addBasketToNewCamCard,
    deleteCamCard,
    updateCamCard,
    loadCustomers,
    loadContactsByCustomer,
    loadDeliveryAddresses
  ),
  on(
    loadCamCardsFail,
    deleteCamCardFail,
    createCamCardFail,
    addBasketToNewCamCardFail,
    updateCamCardFail,
    loadCustomersdFail,
    loadContactsByCustomerFail,
    loadDeliveryAddressesFail,

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
  on(loadContactsByCustomerSuccess, (state: CamCardState, action) => {
    const { customerId, contacts } = action.payload;
    return {
      ...state,
      contacts: { ...state.contacts, [customerId]: contacts },
    };
  }),
  on(loadDeliveryAddressesSuccess, (state: CamCardState, action) => {
    const { addresses } = action.payload;
    return {
      ...state,
      addresses,
      loading: false,
    };
  }),
  on(loadDeliveryAddressesFail, (state: CamCardState) => {
    const addresses = [];

    return {
      ...state,
      addresses,
      loading: false,
    };
  }),
  on(
    addBasketToNewCamCardSuccess,
    createCamCardSuccess,
    updateCamCardSuccess,
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
  on(updateCamCardContactsSuccess, (state: CamCardState, action) => {
    const { camCardId, contacts } = action.payload;
    state.entities[camCardId].contacts = contacts;
    return {
      ...state,
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
