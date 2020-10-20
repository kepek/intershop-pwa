import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamCard, CamCardItem } from '../models/cam-card/cam-card.model';
import {
  addBasketToNewCamCard,
  addProductToCamCard,
  addProductToNewCamCard,
  createCamCard,
  deleteCamCard,
  detectCamCardToolbar,
  getAllCamCards,
  getCamCardCustomers,
  getCamCardError,
  getCamCardLoading,
  getSelectedCamCardDetails,
  isStickyCamCardToolbar,
  moveItemToCamCard,
  removeItemFromCamCard,
  updateCamCard,
  updateCamCardProduct,
} from '../store/cam-card';

@Injectable({ providedIn: 'root' })
export class CamCardsFacade {
  constructor(private store: Store) {}

  camCard$: Observable<CamCard[]> = this.store.pipe(select(getAllCamCards));
  currentCamCard$: Observable<CamCard> = this.store.pipe(select(getSelectedCamCardDetails));
  camCardLoading$: Observable<boolean> = this.store.pipe(select(getCamCardLoading));
  camCardError$: Observable<HttpError> = this.store.pipe(select(getCamCardError));
  isStickyCamCardToolbar$: Observable<boolean> = this.store.pipe(select(isStickyCamCardToolbar));
  customers$: Observable<[]> = this.store.pipe(select(getCamCardCustomers));

  addCamCard(camCards: CamCard): void | HttpError {
    this.store.dispatch(createCamCard({ camCards }));
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

  addProductToNewCamCard(name: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToNewCamCard({ name, sku, quantity }));
  }

  addProductToCamCard(camCardId: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToCamCard({ camCardId, sku, quantity }));
  }

  updateCamCardProduct(rootCamCard: string, camCardId: string, camCardItem: CamCardItem): void {
    this.store.dispatch(updateCamCardProduct({ rootCamCard, camCardId, camCardItem }));
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

  removeProductFromCamCard(camCardId: string, camCardItemId: string): void {
    this.store.dispatch(removeItemFromCamCard({ camCardId, camCardItemId }));
  }

  detectCamCardToolbar() {
    this.store.dispatch(detectCamCardToolbar());
  }
}
