import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  CamCard,
  CamCardAddress,
  CamCardContact,
  CamCardCustomer,
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
  deleteSubCamCard,
  deleteSubCamCardFail,
  deleteSubCamCardSuccess,
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
  unselectCamCard,
  updateCamCard,
  updateCamCardContactsSuccess,
  updateCamCardFail,
  updateCamCardProductSuccess,
  updateCamCardSuccess,
  updateSubCamCard,
  updateSubCamCardFail,
  updateSubCamCardSuccess,
} from './cam-card.actions';

export interface CamCardState extends EntityState<CamCard> {
  loading: boolean;
  selected: string;
  error: HttpError;
  stickyToolbar: boolean;
  customers: CamCardCustomer[];
  addProductSuccess: boolean;
  contacts: {
    [key: string]: CamCardContact[];
  };
  addresses?: CamCardAddress[];
}

export const camCardAdapter = createEntityAdapter<CamCard>({
  selectId: camCard => camCard.id,
});

export const initialState: CamCardState = camCardAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
  customers: [],
  addProductSuccess: false,
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
    deleteSubCamCard,
    updateCamCard,
    loadCustomers,
    loadContactsByCustomer,
    loadDeliveryAddresses,
    updateSubCamCard
  ),
  on(
    loadCamCardsFail,
    deleteCamCardFail,
    deleteSubCamCardFail,
    createCamCardFail,
    addBasketToNewCamCardFail,
    updateCamCardFail,
    loadCustomersdFail,
    loadContactsByCustomerFail,
    loadDeliveryAddressesFail,
    updateSubCamCardFail,

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

    let items: CamCard[] | CamCardItem[] = oldItems.map(item => (item.id === camCardItem.id ? camCardItem : item));

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
  on(updateCamCardContactsSuccess, (state: CamCardState, action) => {
    const { camCardId, contacts } = action.payload;
    return {
      ...state,
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
  }))
);
