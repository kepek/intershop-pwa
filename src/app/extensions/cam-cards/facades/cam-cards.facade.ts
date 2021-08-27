import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { toObservable } from 'ish-core/utils/functions';

import {
  CamCard,
  CamCardContact,
  CamCardCustomer,
  CamCardCustomersAddresses,
  CamCardImportValidationResponse,
  CamCardItem,
  CamCardItemComment,
  CamCardMeasurement,
} from '../models/cam-card/cam-card.model';
import {
  addBasketToNewCamCard,
  addProductToCamCard,
  addProductToNewCamCard,
  addProductToNewCamCardAndEdit,
  addProductToNewSubCamCard,
  addProductToSubCamCard,
  addToNewCamCardWithNewSubCamCard,
  clearVirtualCamCard,
  cloneAndEditCamCard,
  copyCamCard,
  createCamCard,
  createSubCamCard,
  createVirtualCamCard,
  deleteCamCard,
  deleteSubCamCard,
  detectCamCardToolbar,
  getAddProductSuccess,
  getAllCamCards,
  getCamCardCustomers,
  getCamCardDetails,
  getCamCardError,
  getCamCardLoading,
  getCamCardsLoading,
  getContactsbyCustomerId,
  getCustomerAddresses,
  getSelectedCamCardDetails,
  getUserContactForCustomer,
  getValidationErrors,
  getValidationResponse,
  getVirtualCamCard,
  importCamCard,
  isStickyCamCardToolbar,
  loadCamCardIfNotLoaded,
  loadCamCards,
  loadContactsByCustomer,
  loadCustomers,
  loadDeliveryAddresses,
  moveCamCard,
  moveCamCardItem,
  moveItemToCamCard,
  removeItemFromCamCard,
  resetCamCardItemPositions,
  unselectCamCard,
  updateCamCard,
  updateCamCardAttribute,
  updateCamCardContacts,
  updateCamCardProduct,
  updateSubCamCard,
  validateCamCardImport,
} from '../store/cam-card';

@Injectable({ providedIn: 'root' })
export class CamCardsFacade {
  constructor(private store: Store) {}

  camCard$: Observable<CamCard[]> = this.store.pipe(select(getAllCamCards));
  currentCamCard$: Observable<CamCard> = this.store.pipe(select(getSelectedCamCardDetails));
  camCardLoading$: Observable<boolean> = this.store.pipe(select(getCamCardLoading));
  camCardsLoading$: Observable<boolean> = this.store.pipe(select(getCamCardsLoading));
  camCardError$: Observable<HttpError> = this.store.pipe(select(getCamCardError));
  isStickyCamCardToolbar$: Observable<boolean> = this.store.pipe(select(isStickyCamCardToolbar));
  customers$: Observable<CamCardCustomer[]> = this.store.pipe(select(getCamCardCustomers));
  addresses$: Observable<CamCardCustomersAddresses> = this.store.pipe(select(getCustomerAddresses));
  virtualCamCard$: Observable<CamCard> = this.store.pipe(select(getVirtualCamCard));
  validationErrors$: Observable<HttpError> = this.store.pipe(select(getValidationErrors));
  validationResponse$: Observable<CamCardImportValidationResponse> = this.store.pipe(select(getValidationResponse));
  getAddProductSuccess$: Observable<boolean> = this.store.pipe(select(getAddProductSuccess));

  getCamCardDetails$(id: string | Observable<string>) {
    return toObservable(id).pipe(
      tap(camCardId => this.store.dispatch(loadCamCardIfNotLoaded({ camCardId }))),
      switchMap(camCardId => this.store.pipe(select(getCamCardDetails, { id: camCardId })))
    );
  }

  contactsByCustomer$(id: string): Observable<CamCardContact[]> {
    return this.store.pipe(select(getContactsbyCustomerId, { id }));
  }

  loadContactsByCustomer(customerId: string): void | HttpError {
    this.store.dispatch(loadContactsByCustomer({ customerId }));
  }

  getUserContactForCustomer$(customerId: string): Observable<CamCardContact> {
    return this.store.pipe(select(getUserContactForCustomer, { customerId }));
  }

  loadCamCards() {
    this.store.dispatch(loadCamCards());
  }

  loadCustomers() {
    this.store.dispatch(loadCustomers());
  }

  copyCamCard(camCardId: string, name: string): void | HttpError {
    this.store.dispatch(copyCamCard({ camCardId, name }));
  }

  moveCamCard(camCardId: string, newCustomerId: string, newContacts: CamCardContact[]): void {
    this.store.dispatch(moveCamCard({ camCardId, newCustomerId, newContacts }));
  }

  addCamCard(camCards: CamCard): void | HttpError {
    this.store.dispatch(createCamCard({ camCards }));
  }

  createSubCamCard(subCamCard: CamCard, rootCamCardId: string) {
    this.store.dispatch(createSubCamCard({ subCamCard, rootCamCardId }));
  }

  createVirtualCamCard(virtualCamCard: CamCard) {
    this.store.dispatch(createVirtualCamCard({ camCard: virtualCamCard }));
  }

  clearVirtualCamCard() {
    this.store.dispatch(clearVirtualCamCard());
  }

  getDeliveryAddress(id) {
    this.store.dispatch(loadDeliveryAddresses({ id }));
  }

  addBasketToNewCamCard(camCards: CamCard): void | HttpError {
    this.store.dispatch(addBasketToNewCamCard({ camCards }));
  }

  deleteCamCard(id: string): void {
    this.store.dispatch(deleteCamCard({ camCardId: id }));
  }

  deleteSubCamCard(rootId: string, id: string): void {
    this.store.dispatch(deleteSubCamCard({ rootId, id }));
  }

  cloneAndEditPermanentCamCard(camCardId: string, camCardName: string) {
    this.store.dispatch(cloneAndEditCamCard({ camCardId, camCardName }));
  }

  updateCamCard(camCard: CamCard): void {
    this.store.dispatch(updateCamCard({ camCard }));
  }

  updateSubCamCard(sub: CamCard): void {
    this.store.dispatch(updateSubCamCard({ sub }));
  }

  addToNewCamCardWithNewSubCamCard(
    newCamCard: CamCard,
    newSubCamCard: CamCard,
    sku: string,
    quantity?: number,
    boxLabel?: string,
    measurement?: CamCardMeasurement,
    edit?: boolean
  ): void {
    this.store.dispatch(
      addToNewCamCardWithNewSubCamCard({ newCamCard, newSubCamCard, sku, quantity, boxLabel, measurement, edit })
    );
  }

  addProductToNewCamCard(name: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToNewCamCard({ name, sku, quantity }));
  }

  addProductToCamCard(
    camCardId: string,
    sku: string,
    quantity?: number,
    comment?: CamCardItemComment,
    measurement?: CamCardMeasurement,
    position?: number,
    showSuccessToast?: boolean
  ): void {
    this.store.dispatch(
      addProductToCamCard({ camCardId, sku, quantity, position, comment, measurement, showSuccessToast })
    );
  }

  addProductToSubCamCard(
    camCardId: string,
    refreshCamCardId: string,
    sku: string,
    quantity?: number,
    boxLabel?: string,
    measurement?: CamCardMeasurement
  ): void {
    this.store.dispatch(addProductToSubCamCard({ camCardId, refreshCamCardId, sku, quantity, boxLabel, measurement }));
  }

  addProductToNewSubCamCard(
    subCamCard: CamCard,
    rootCamCard: CamCard,
    sku: string,
    quantity?: number,
    boxLabel?: string,
    measurement?: CamCardMeasurement,
    edit?: boolean
  ): void {
    this.store.dispatch(
      addProductToNewSubCamCard({ subCamCard, rootCamCard, sku, quantity, boxLabel, measurement, edit })
    );
  }

  addProductToNewCamCardAndEdit(
    camCard: CamCard,
    sku: string,
    quantity?: number,
    boxLabel?: string,
    measurement?: CamCardMeasurement,
    edit?: boolean
  ): void {
    this.store.dispatch(addProductToNewCamCardAndEdit({ camCard, sku, quantity, boxLabel, measurement, edit }));
  }

  updateCamCardProduct(
    rootCamCard: string,
    camCardId: string,
    camCardItem: CamCardItem,
    forceUpdateCamCard?: boolean
  ): void {
    this.store.dispatch(updateCamCardProduct({ rootCamCard, camCardId, camCardItem, forceUpdateCamCard }));
  }

  updateCamCardContacts(camCardId: string, camCardContacts: CamCardContact[]): void {
    this.store.dispatch(updateCamCardContacts({ camCardId, camCardContacts }));
  }

  moveItemToCamCard(
    sourcecamCardId: string,
    targetcamCardId: string,
    camCardItemId: string,
    sku: string,
    quantity: number
  ): void {
    this.store.dispatch(
      moveItemToCamCard({
        source: { id: sourcecamCardId, camCardItemId },
        target: { id: targetcamCardId, sku, quantity },
      })
    );
  }

  moveItemToNewCamCard(
    sourceCamCardId: string,
    name: string,
    camCardItemId: string,
    sku: string,
    quantity: number
  ): void {
    this.store.dispatch(
      moveItemToCamCard({ source: { id: sourceCamCardId, camCardItemId }, target: { name, sku, quantity } })
    );
  }

  moveCamCardItem(sourceCamCardId: string, targetCamCardId: string, camCardItem: CamCardItem, position?: number): void {
    this.store.dispatch(
      moveCamCardItem({
        source: { id: sourceCamCardId, camCardItem },
        target: { id: targetCamCardId, position },
      })
    );
  }

  removeProductFromCamCard(camCardId: string, camCardItemId: string, rootCamCard?: string): void {
    this.store.dispatch(removeItemFromCamCard({ camCardId, camCardItemId, rootCamCard }));
  }

  detectCamCardToolbar() {
    this.store.dispatch(detectCamCardToolbar());
  }

  unSelectCamCard() {
    this.store.dispatch(unselectCamCard());
  }

  resetItemPositions(camCard: CamCard) {
    this.store.dispatch(resetCamCardItemPositions({ camCard }));
  }

  validateCamCardImport(camCardData): void | HttpError {
    this.store.dispatch(validateCamCardImport({ camCardData }));
  }

  importCamCard(camCardData): void | HttpError {
    this.store.dispatch(importCamCard({ camCardData }));
  }

  updateCamCardAttribute(camCardId: string, camCardAttribute) {
    this.store.dispatch(updateCamCardAttribute({ camCardId, camCardAttribute }));
  }
}
