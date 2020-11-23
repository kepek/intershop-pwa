import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import {
  CamCard,
  CamCardAddress,
  CamCardContact,
  CamCardCustomer,
  CamCardItem,
} from '../models/cam-card/cam-card.model';
import {
  addBasketToNewCamCard,
  addProductToCamCard,
  addProductToCamCardAndUpdate,
  addProductToNewCamCard,
  addProductToNewCamCardAndUpdate,
  addProductToNewSubCamCard,
  addToNewCamCardWithNewSubCamCard,
  createCamCard,
  deleteCamCard,
  detectCamCardToolbar,
  getAllCamCards,
  getCamCardCustomers,
  getCamCardError,
  getCamCardLoading,
  getContactsbyCustomerId,
  getCreated,
  getCustomerAddresses,
  getSelectedCamCardDetails,
  isStickyCamCardToolbar,
  loadContactsByCustomer,
  loadDeliveryAddresses,
  moveCamCard,
  moveItemToCamCard,
  removeItemFromCamCard,
  resetCamCardItemPositions,
  resetCreatedCamCard,
  updateCamCard,
  updateCamCardContacts,
  updateCamCardProduct,
  updateSubCamCard,
} from '../store/cam-card';

@Injectable({ providedIn: 'root' })
export class CamCardsFacade {
  constructor(private store: Store) {}

  camCard$: Observable<CamCard[]> = this.store.pipe(select(getAllCamCards));
  currentCamCard$: Observable<CamCard> = this.store.pipe(select(getSelectedCamCardDetails));
  camCardLoading$: Observable<boolean> = this.store.pipe(select(getCamCardLoading));
  camCardError$: Observable<HttpError> = this.store.pipe(select(getCamCardError));
  isStickyCamCardToolbar$: Observable<boolean> = this.store.pipe(select(isStickyCamCardToolbar));
  customers$: Observable<CamCardCustomer[]> = this.store.pipe(select(getCamCardCustomers));
  addresses$: Observable<CamCardAddress[]> = this.store.pipe(select(getCustomerAddresses));
  created$: Observable<{ name: string; id: string }> = this.store.pipe(select(getCreated));

  contactsByCustomer$(id: string): Observable<CamCardContact[]> {
    return this.store.pipe(select(getContactsbyCustomerId, { id }));
  }

  loadContactsByCustomer(customerId: string): void | HttpError {
    this.store.dispatch(loadContactsByCustomer({ customerId }));
  }

  moveCamCard(camCardId: string, newCustomerId: string, newContacts: CamCardContact[]): void {
    this.store.dispatch(moveCamCard({ camCardId, newCustomerId, newContacts }));
  }

  addCamCard(camCards: CamCard): void | HttpError {
    this.store.dispatch(createCamCard({ camCards }));
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
    edit?: boolean
  ): void {
    this.store.dispatch(addToNewCamCardWithNewSubCamCard({ newCamCard, newSubCamCard, sku, quantity, boxLabel, edit }));
  }

  addProductToNewCamCard(name: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToNewCamCard({ name, sku, quantity }));
  }

  addProductToCamCard(
    camCardId: string,
    sku: string,
    quantity?: number,
    boxLabel?: string,
    showSuccessToast?: boolean
  ): void {
    this.store.dispatch(addProductToCamCard({ camCardId, sku, quantity, boxLabel, showSuccessToast }));
  }

  resetCreatedCamCard() {
    this.store.dispatch(resetCreatedCamCard());
  }

  addProductToNewSubCamCard(
    subCamCard: CamCard,
    rootCamCard: string,
    sku: string,
    quantity?: number,
    boxLabel?: string,
    edit?: boolean
  ): void {
    this.store.dispatch(addProductToNewSubCamCard({ subCamCard, rootCamCard, sku, quantity, boxLabel, edit }));
  }

  addProductToNewCamCardAndUpdate(
    camCard: CamCard,
    sku: string,
    quantity?: number,
    boxLabel?: string,
    edit?: boolean
  ): void {
    this.store.dispatch(addProductToNewCamCardAndUpdate({ camCard, sku, quantity, boxLabel, edit }));
  }

  addProductToCamCardAndUpdate(
    camCardId: string,
    sku: string,
    camCardItems: CamCardItem[],
    quantity?: number,
    boxLabel?: string
  ) {
    this.store.dispatch(addProductToCamCardAndUpdate({ camCardId, sku, camCardItems, quantity, boxLabel }));
  }

  updateCamCardProduct(rootCamCard: string, camCardId: string, camCardItem: CamCardItem): void {
    this.store.dispatch(updateCamCardProduct({ rootCamCard, camCardId, camCardItem }));
  }

  updateCamCardContacts(camCardId: string, camCardContacts: CamCardContact[]): void {
    this.store.dispatch(updateCamCardContacts({ camCardId, camCardContacts }));
  }

  moveItemToCamCard(
    sourcecamCardId: string,
    targetcamCardId: string,
    camCardItemId: string,
    sku: string,
    quantity: number,
    position?: number
  ): void {
    this.store.dispatch(
      moveItemToCamCard({
        source: { id: sourcecamCardId, camCardItemId },
        target: { id: targetcamCardId, sku, quantity, position },
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

  removeProductFromCamCard(camCardId: string, camCardItemId: string): void {
    this.store.dispatch(removeItemFromCamCard({ camCardId, camCardItemId }));
  }

  detectCamCardToolbar() {
    this.store.dispatch(detectCamCardToolbar());
  }

  resetItemPositions(rootCamCardId: string, camCardId: string, gapSize: number) {
    console.log('🚀 ~ file: cam-cards.facade.ts ~ CamCardsFacade ~ resetItemPositions ~ gapSize', gapSize);
    console.log('🚀 ~ file: cam-cards.facade.ts ~ CamCardsFacade ~ resetItemPositions ~ camCardId', camCardId);
    console.log('🚀 ~ file: cam-cards.facade.ts ~ CamCardsFacade ~ resetItemPositions ~ rootCamCardId', rootCamCardId);
    this.store.dispatch(resetCamCardItemPositions({ rootCamCardId, camCardId, gapSize }));
  }
}
