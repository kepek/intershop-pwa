import { Injectable } from '@angular/core';
import { Observable, forkJoin, throwError } from 'rxjs';
import { concatMap, defaultIfEmpty, map, switchMap } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { CamCardCreate } from '../../models/cam-card/cam-card-create.interface';
import { CamCardData } from '../../models/cam-card/cam-card.interface';
import { CamCardMapper } from '../../models/cam-card/cam-card.mapper';
import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

@Injectable({ providedIn: 'root' })
export class CamCardService {
  constructor(private apiService: ApiService, private camCardMapper: CamCardMapper) {}

  /**
   * Gets a list of cam cards for the current user.
   * @returns           The customer's cam_cards.
   */
  getCamCards(): Observable<CamCard[]> {
    return this.apiService.get('camcards').pipe(
      unpackEnvelope(),
      map(camCardData => camCardData.map((camCard: CamCardData) => this.getCamCard(camCard.id))),
      // tslint:disable-next-line:no-unnecessary-callback-wrapper
      switchMap(obsArray => forkJoin(obsArray)),
      defaultIfEmpty([])
    );
  }

  /**
   * Gets a cam cards of the given id for the current user.
   * @param camCardId  The cam cards id.
   * @returns           The cam_cards.
   */
  getCamCard(camCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('getCamCard() called without camCardId');
    }
    return this.apiService
      .get<CamCardData>(`camcards/${camCardId}`)
      .pipe(map(camCardData => this.camCardMapper.fromData(camCardData)));
  }

  /**
   * Creates a cam cards for the current user.
   * @param CamCardDetails   The cam cards data.
   * @returns                 The created cam_cards.
   */
  createCamCard(camCardData: CamCard): Observable<CamCard> {
    return this.apiService
      .post('camcards', { ...camCardData, name: camCardData.name })
      .pipe(concatMap((response: CamCardCreate) => this.getCamCard(response.itemId)));
  }

  /**
   * Deletes a cam cards of the given id.
   * @param camCardId   The cam cards id.
   * @returns            The cam_cards.
   */
  deleteCamCard(camCardId: string): Observable<void> {
    if (!camCardId) {
      return throwError('deleteCamCardt() called without camCardId');
    }
    return this.apiService.delete(`camcards/${camCardId}`);
  }

  /**
   * Updates a cam cards of the given id.
   * @param camCards   The cam cards to be updated.
   * @returns          The updated cam_cards.
   */
  updateCamCard(camCard: CamCard): Observable<CamCard> {
    return this.apiService
      .put(`camcards/${camCard.id}`, camCard)
      .pipe(map((response: CamCard) => this.camCardMapper.fromUpdate(response, camCard.id)));
  }

  /**
   * Gets a sub cam cards list from cam card.
   * @returns           The sub cam_cards.
   * @param camCardId   The cam card id.
   */
  getSubCamCards(camCardId: string): Observable<CamCard[]> {
    return this.apiService.get(`camcards/${camCardId}/childcamcards`).pipe(
      unpackEnvelope(),
      map((subCamCards: CamCardData[]) => subCamCards.map(subCamCard => this.camCardMapper.fromData(subCamCard))),
      // tslint:disable-next-line:no-unnecessary-callback-wrapper
      switchMap(obsArray => forkJoin(obsArray)),
      defaultIfEmpty([])
    );
  }

  /**
   * Delete all sub cam cards from cam card.
   * @returns           The cam_card.
   * @param camCardId   The cam card id.
   */
  deleteAllSubCamCards(camCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeAllSubCamCards() called without camCardId');
    }
    return this.apiService
      .delete(`camcards/${camCardId}/childcamcards`)
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Deletes a sub cam card from cam card.
   * @returns             The cam_cards.
   * @param camCardId     The cam card id.
   * @param subCamCardId  The sub cam card id.
   */
  deleteSubCamCard(camCardId: string, subCamCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeSubCamCard() called without camCardId');
    }
    return this.apiService
      .delete(`camcards/${camCardId}/childcamcards/${subCamCardId}`)
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Gets a cam card products of the given id.
   * @returns           The cam_card items.
   * @param camCardId  The cam card id.
   */
  getProductsFromCamCard(camCardId: string): Observable<CamCardItem[]> {
    if (!camCardId) {
      return throwError('getCamCardProduct() called without camCardId');
    }
    return this.apiService.get<CamCardItem[]>(`camcards/${camCardId}/products`);
  }

  /**
   * Gets a cam card product of the given id.
   * @returns           The cam_card item.
   * @param camCardId  The cam card id.
   * @param camCardItemId  The cam card item id.
   */
  getCamCardProduct(camCardId: string, camCardItemId: string): Observable<CamCardItem> {
    if (!camCardId) {
      return throwError('getCamCardProduct() called without camCardId');
    }
    if (!camCardItemId) {
      return throwError('getCamCardProduct() called without camCardItemId');
    }
    return this.apiService.get<CamCardItem>(`camcards/${camCardId}/products/${camCardItemId}`);
  }

  /**
   * Adds a product to the cam cards with the given id and reloads the cam_cards.
   * @param camCardId
   * @param sku           The product sku.
   * @param count
   * @returns             The changed cam_cards.
   */
  addProductToCamCard(camCardId: string, sku: string, count: number): Observable<CamCard> {
    return this.apiService
      .post(`camcards/${camCardId}/products`, {
        count,
        product: { sku },
      })
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Update a product from the cam card with the given id. Returns an error observable if parameters are falsy.
   * @returns             The changed cam card item.
   * @param camCardId
   * @param camCardItemId
   */
  updateCamCardProduct(camCardId: string, camCardItem: CamCardItem): Observable<CamCardItem> {
    return this.apiService
      .post(`camcards/${camCardId}/products`, camCardItem)
      .pipe(concatMap(({ id }) => this.getCamCardProduct(camCardId, id)));
  }

  /**
   * Removes a product from the cam cards with the given id. Returns an error observable if parameters are falsy.
   * @returns             The changed cam_cards.
   * @param camCardId
   * @param camCardItemId
   */
  removeProductFromCamCard(camCardId: string, camCardItemId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeProductFromCamCard() called without camCardId');
    }
    if (!camCardItemId) {
      return throwError('removeProductFromCamCard() called without camCard Item Id');
    }
    return this.apiService
      .delete(`camcards/${camCardId}/products/${camCardItemId}`)
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Removes all products from the cam cards with the given id. Returns an error observable if parameters are falsy.
   * @returns             The changed cam_cards.
   * @param camCardId
   */
  removeAllProductsFromCamCard(camCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeAllProductsFromCamCard() called without camCardId');
    }
    return this.apiService.delete(`camcards/${camCardId}/products`).pipe(concatMap(() => this.getCamCard(camCardId)));
  }
}
