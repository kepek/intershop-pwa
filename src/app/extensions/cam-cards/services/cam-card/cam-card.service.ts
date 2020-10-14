import { Injectable } from '@angular/core';
import { Observable, forkJoin, throwError } from 'rxjs';
import { concatMap, defaultIfEmpty, map, switchMap } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { CamCardData } from '../../models/cam-card/cam-card.interface';
import { CamCardMapper } from '../../models/cam-card/cam-card.mapper';
import { CamCard, CamCardHeader } from '../../models/cam-card/cam-card.model';

@Injectable({ providedIn: 'root' })
export class CamCardService {
  constructor(private apiService: ApiService, private camCardMapper: CamCardMapper) {}

  /**
   * Gets a list of cam cards for the current user.
   * @returns           The customer's cam_cards.
   */
  getCamCards(): Observable<CamCard[]> {
    return this.apiService.get(`camcards`).pipe(
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
  createCamCard(camCardData: CamCardHeader): Observable<CamCard> {
    return this.apiService
      .post('camcards', camCardData)
      .pipe(concatMap((response: CamCardData) => this.getCamCard(response.id)));
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
   * Adds a product to the cam cards with the given id and reloads the cam_cards.
   * @param camCards Id   The cam cards id.
   * @param sku           The product sku.
   * @param quantity      The product quantity (default = 1).
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
   * Removes a product from the cam cards with the given id. Returns an error observable if parameters are falsy.
   * @param wishlist Id   The cam cards id.
   * @param sku           The product sku.
   * @returns             The changed cam_cards.
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
}
