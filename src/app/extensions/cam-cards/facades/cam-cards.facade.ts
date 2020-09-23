import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamCard, CamCardHeader } from '../models/cam-card/cam-card.model';
import {
  addBasketToNewCamCard,
  addProductToCamCard,
  addProductToNewCamCard,
  createCamCard,
  deleteCamCard,
  getAllCamCards,
  getCamCardError,
  getCamCardLoading,
  getSelectedCamCardDetails,
  moveItemToCamCard,
  removeItemFromCamCard,
  updateCamCard,
} from '../store/cam-card';

@Injectable({ providedIn: 'root' })
export class CamCardsFacade {
  constructor(private store: Store) {}

  camCard$: Observable<CamCard[]> = this.store.pipe(select(getAllCamCards));
  currentCamCard$: Observable<CamCard> = this.store.pipe(select(getSelectedCamCardDetails));
  camCardLoading$: Observable<boolean> = this.store.pipe(select(getCamCardLoading));
  camCardError$: Observable<HttpError> = this.store.pipe(select(getCamCardError));

  addCamCard(camCards: CamCardHeader): void | HttpError {
    this.store.dispatch(createCamCard({ camCards }));
  }

  addBasketToNewCamCard(camCards: CamCardHeader): void | HttpError {
    this.store.dispatch(addBasketToNewCamCard({ camCards }));
  }

  deleteCamCard(id: string): void {
    this.store.dispatch(deleteCamCard({ camCardId: id }));
  }

  updateCamCard(camCard: CamCard): void {
    this.store.dispatch(updateCamCard({ camCard }));
  }

  addProductToNewCamCard(title: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToNewCamCard({ title, sku, quantity }));
  }

  addProductToCamCard(camCardId: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToCamCard({ camCardId, sku, quantity }));
  }

  moveItemToCamCard(sourcecamCardId: string, targetcamCardId: string, sku: string, quantity: number): void {
    this.store.dispatch(
      moveItemToCamCard({
        source: { id: sourcecamCardId },
        target: { id: targetcamCardId, sku, quantity },
      })
    );
  }

  moveItemToNewCamCard(sourceCamCardId: string, title: string, sku: string, quantity: number): void {
    this.store.dispatch(moveItemToCamCard({ source: { id: sourceCamCardId }, target: { title, sku, quantity } }));
  }

  removeProductFromCamCard(camCardId: string, sku: string): void {
    this.store.dispatch(removeItemFromCamCard({ camCardId, sku }));
  }
}
