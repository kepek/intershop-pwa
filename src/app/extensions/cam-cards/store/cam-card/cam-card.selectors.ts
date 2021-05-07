import { createSelector } from '@ngrx/store';

import { CamCard, CamCardContact } from '../../models/cam-card/cam-card.model';
import { getCamCardsState } from '../cam-cards-store';

import { camCardAdapter, initialState } from './cam-card.reducer';

const getCamCardState = createSelector(getCamCardsState, state => (state ? state.camCards : initialState));

const { selectEntities, selectAll } = camCardAdapter.getSelectors(getCamCardState);

export const getAllCamCards = selectAll;

export const getCamCardLoading = createSelector(getCamCardState, state => state.loading);

export const getCamCardsLoading = createSelector(getCamCardState, state => state.camCardsLoading);

export const getCamCardCustomers = createSelector(getCamCardState, state => state.customers);

export const getCamCardContacts = createSelector(getCamCardState, state => state.contacts);

export const getUserContact = createSelector(getCamCardState, state => state.userContact);

export const getCustomerAddresses = createSelector(getCamCardState, state => state.addresses);

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

export const getContactsbyCustomerId = createSelector(
  getCamCardContacts,
  (contacts, props: { id: string }): CamCardContact[] => props.id && contacts[props.id]
);

export const getUserContactForCustomer = createSelector(
  getUserContact,
  (userContact, props: { customerId: string }): CamCardContact => props.customerId && userContact[props.customerId]
);

export const isStickyCamCardToolbar = createSelector(getCamCardState, state => state.stickyToolbar);

export const getVirtualCamCard = createSelector(getCamCardState, state => state.virtualCamCard);

export const getValidationErrors = createSelector(getCamCardState, state => state.validationErrors);
export const getValidationResponse = createSelector(getCamCardState, state => state.validationResponse);
